-- 🔍 DIAGNOSE RLS POLICIES AND PROFILE ISSUES
-- Run these queries in Supabase SQL Editor to diagnose loading issues

-- ========================================
-- 1. CHECK IF PROFILES TABLE EXISTS
-- ========================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'profiles';

-- Expected: Should return one row with 'profiles'
-- If empty: Table doesn't exist - run your schema setup SQL


-- ========================================
-- 2. CHECK RLS STATUS ON PROFILES TABLE
-- ========================================
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- Expected: rowsecurity = true
-- This shows if RLS is enabled


-- ========================================
-- 3. CHECK ALL RLS POLICIES ON PROFILES
-- ========================================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,  -- SELECT, INSERT, UPDATE, DELETE, ALL
    qual,  -- USING clause
    with_check  -- WITH CHECK clause
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Expected: Should see policies like:
-- - "Public profiles are viewable by everyone" (SELECT)
-- - "Users can update own profile" (UPDATE)


-- ========================================
-- 4. CHECK IF YOUR USER HAS A PROFILE
-- ========================================
-- Replace YOUR_USER_ID with your actual user ID from the console logs
-- Look for: "📋 Fetching profile for user: YOUR_USER_ID"

SELECT *
FROM profiles
WHERE id = 'YOUR_USER_ID';  -- <-- REPLACE THIS!

-- Expected: Should return one row with your profile data
-- If empty: Profile was never created - trigger didn't work or manual creation failed


-- ========================================
-- 5. CHECK ALL PROFILES (COUNT)
-- ========================================
SELECT COUNT(*) as total_profiles
FROM profiles;

-- Expected: Should show number of profiles in database


-- ========================================
-- 6. CHECK IF SELECT POLICY EXISTS
-- ========================================
-- This is the most important one - if missing, profile fetch will hang

SELECT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'profiles'
      AND cmd = 'SELECT'
) as has_select_policy;

-- Expected: true
-- If false: You need to add a SELECT policy!


-- ========================================
-- 7. FIX: ADD SELECT POLICY IF MISSING
-- ========================================
-- Run this ONLY if query #6 returned false

-- Option 1: Allow everyone to read all profiles (recommended for this app)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Option 2: Allow users to only read their own profile
-- CREATE POLICY "Users can view own profile"
--   ON profiles FOR SELECT
--   USING (auth.uid() = id);


-- ========================================
-- 8. CHECK TRIGGER EXISTS
-- ========================================
SELECT tgname, tgtype, tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- Expected: Should return one row showing the trigger
-- If empty: Trigger was never created - run fix-with-trigger.sql


-- ========================================
-- 9. CHECK TRIGGER FUNCTION EXISTS
-- ========================================
SELECT proname, prosrc
FROM pg_proc
WHERE proname = 'handle_new_user';

-- Expected: Should return the function with its source code
-- If empty: Function was never created - run fix-with-trigger.sql


-- ========================================
-- 10. TEST PROFILE QUERY AS AUTHENTICATED USER
-- ========================================
-- This simulates what your app does
-- First, get your user ID from auth.users:

SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Then test if you can query profiles:
SELECT *
FROM profiles
WHERE id = 'YOUR_USER_ID';  -- <-- REPLACE WITH YOUR ACTUAL USER ID!


-- ========================================
-- COMMON FIXES
-- ========================================

-- FIX A: If profile doesn't exist, create it manually
-- (Replace values with your actual user data)
/*
INSERT INTO profiles (id, email, full_name, role)
VALUES (
    'YOUR_USER_ID',  -- From auth.users
    'your-email@example.com',
    'Your Full Name',
    'inviter'
);
*/

-- FIX B: If RLS SELECT policy is missing, add it
-- (Uncomment and run if needed)
/*
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);
*/

-- FIX C: If you want to temporarily disable RLS for testing
-- (NOT RECOMMENDED for production!)
/*
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
*/

-- FIX D: Re-enable RLS after testing
/*
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
*/


-- ========================================
-- DEBUGGING TIPS
-- ========================================

-- 1. Check Supabase logs:
--    Dashboard → Logs → Database
--    Look for failed queries or permission errors

-- 2. Check your app console:
--    Look for the user ID in: "📋 Fetching profile for user: <ID>"
--    Use that ID in query #4 above

-- 3. If query hangs in SQL Editor too:
--    - RLS is likely blocking it
--    - Add the SELECT policy (Fix B)

-- 4. If query works in SQL Editor but not in app:
--    - Check network connectivity
--    - Check Supabase API key is correct
--    - Check CORS settings

-- 5. If you see timeout errors in console:
--    - The query is being blocked
--    - Most likely RLS SELECT policy is missing
--    - Run Fix B above
