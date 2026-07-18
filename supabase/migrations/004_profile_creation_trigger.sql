-- ================================================
-- ALTERNATIVE SOLUTION: AUTO-CREATE PROFILE WITH DATABASE TRIGGER
-- This is the RECOMMENDED approach for production
-- ================================================

-- This approach automatically creates a profile when a user signs up
-- No need to manually insert from the client side
-- This avoids RLS issues entirely for profile creation

-- Step 1: Create a function that creates a profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert profile with data from user metadata
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    -- Extract full_name from raw_user_meta_data JSON
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    -- Extract role from raw_user_meta_data JSON, default to 'inviter'
    COALESCE(new.raw_user_meta_data->>'role', 'inviter')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: The raw_user_meta_data field contains the 'data' object passed during signUp
-- Example: supabase.auth.signUp({ email, password, options: { data: { full_name: 'John', role: 'inviter' } } })
-- This becomes: raw_user_meta_data = { "full_name": "John", "role": "inviter" }

-- Step 2: Create a trigger that runs after a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Update the RLS policies to allow the trigger to insert
-- Drop the manual insert policy since we're using a trigger
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;

-- The trigger runs with SECURITY DEFINER, so it bypasses RLS
-- We only need SELECT and UPDATE policies for users

-- Allow everyone to view all profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admins to update any profile
DROP POLICY IF EXISTS "Admins can update any profile." ON profiles;
CREATE POLICY "Admins can update any profile."
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Step 4: Test the trigger
-- After running this, when you sign up a new user via Supabase Auth,
-- the profile will be created automatically!

-- To verify:
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;
