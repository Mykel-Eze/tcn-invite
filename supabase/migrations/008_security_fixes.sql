-- ================================================================
-- 008 SECURITY FIXES  —  ⚠️ RUN THIS IN THE SUPABASE SQL EDITOR ⚠️
--
-- Closes three vulnerabilities and adds missing columns:
--   1. Privilege escalation at signup: the handle_new_user trigger
--      copied `role` from client-supplied metadata, so anyone could
--      sign up as 'admin' by calling the auth API directly.
--   2. Privilege escalation via self-update: the "Users can update
--      own profile" policy had no column restrictions, so any user
--      could PATCH their own role to 'admin' via the REST API.
--   3. Data exposure: profiles SELECT was `USING (true)`, so anyone
--      on the internet with the (public) anon key could dump every
--      member's name, email, and role.
--
-- The script is idempotent — safe to run more than once.
-- ================================================================

-- ----------------------------------------------------------------
-- 1. Role helper functions
--    SECURITY DEFINER lets policies check roles without triggering
--    RLS recursion on the profiles table itself.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(public.current_user_role() = 'admin', false)
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_host()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(public.current_user_role() IN ('admin', 'pcu_host'), false)
$$;

-- ----------------------------------------------------------------
-- 2. Harden the signup trigger: NEVER read `role` from client
--    metadata. New users are always 'inviter'; only an admin can
--    promote them afterwards.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    new.raw_user_meta_data->>'phone',
    'inviter'  -- SECURITY: role is fixed server-side, metadata is ignored
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------
-- 3. Block role changes by non-admins at the row level.
--    This protects the `role` column no matter which RLS policy the
--    write comes through.
--    (auth.uid() IS NULL = service role / SQL editor, which stays
--    unrestricted so you can manage roles from the dashboard.)
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_role_permissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      -- Non-admins can only create themselves as a regular member
      new.role := 'inviter';
    ELSIF TG_OP = 'UPDATE' AND new.role IS DISTINCT FROM old.role THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS enforce_role_permissions ON public.profiles;
CREATE TRIGGER enforce_role_permissions
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_role_permissions();

-- ----------------------------------------------------------------
-- 4. Profiles policies: stop exposing every member to the internet.
--    Users see their own profile; admins and PCU hosts see all
--    (needed for the admin dashboard and invite verification).
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins and hosts can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins and hosts can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin_or_host());

-- Self-insert stays (fallback when the trigger didn't run); the
-- enforce_role_permissions trigger pins the role to 'inviter'.
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update profiles." ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile." ON public.profiles;
CREATE POLICY "Admins can update any profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------
-- 5. Invitations policies, rebuilt on the helper functions
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "Inviters can view own invitations." ON public.invitations;
CREATE POLICY "Inviters can view own invitations."
  ON public.invitations FOR SELECT
  TO authenticated
  USING (auth.uid() = inviter_id);

DROP POLICY IF EXISTS "Inviters can insert own invitations." ON public.invitations;
CREATE POLICY "Inviters can insert own invitations."
  ON public.invitations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = inviter_id);

DROP POLICY IF EXISTS "Admins can view all invitations." ON public.invitations;
CREATE POLICY "Admins can view all invitations."
  ON public.invitations FOR SELECT
  TO authenticated
  USING (public.is_admin_or_host());

DROP POLICY IF EXISTS "Admins can update all invitations." ON public.invitations;
CREATE POLICY "Admins can update all invitations."
  ON public.invitations FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_host())
  WITH CHECK (public.is_admin_or_host());

-- ----------------------------------------------------------------
-- 6. Campuses admin policies, rebuilt on the helper functions
--    (public read stays — campus names/addresses appear on flyers)
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "Allow admins to update campuses" ON public.campuses;
CREATE POLICY "Allow admins to update campuses"
  ON public.campuses FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow admins to insert campuses" ON public.campuses;
CREATE POLICY "Allow admins to insert campuses"
  ON public.campuses FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------
-- 7. Columns the app writes/reads that are missing from the
--    original schema
-- ----------------------------------------------------------------
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS guest_email text;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS service_time text;
ALTER TABLE public.campuses ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
UPDATE public.campuses SET is_active = true WHERE is_active IS NULL;

-- User phone numbers (collected at signup / in profile settings)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- ----------------------------------------------------------------
-- Verify
-- ----------------------------------------------------------------
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'invitations', 'campuses')
ORDER BY tablename, cmd, policyname;
