-- ================================================
-- COMPLETE RLS FIX FOR PROFILES TABLE
-- Run this entire script in Supabase SQL Editor
-- ================================================

-- Step 1: Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles." ON profiles;

-- Step 2: Recreate policies with correct permissions

-- Allow everyone to view all profiles (needed for inviter info display)
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own profile during signup
-- IMPORTANT: This uses auth.uid() which is the authenticated user's ID
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admins to update any profile (for role management)
CREATE POLICY "Admins can update any profile."
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ================================================
-- FIX INVITATIONS POLICIES
-- ================================================

-- Step 3: Drop existing invitation policies
DROP POLICY IF EXISTS "Inviters can view own invitations." ON invitations;
DROP POLICY IF EXISTS "Inviters can insert own invitations." ON invitations;
DROP POLICY IF EXISTS "Admins can view all invitations." ON invitations;
DROP POLICY IF EXISTS "Admins can update all invitations." ON invitations;

-- Step 4: Recreate invitation policies

-- Allow inviters to view their own invitations
CREATE POLICY "Inviters can view own invitations."
  ON invitations FOR SELECT
  USING (auth.uid() = inviter_id);

-- Allow inviters to insert their own invitations
CREATE POLICY "Inviters can insert own invitations."
  ON invitations FOR INSERT
  WITH CHECK (auth.uid() = inviter_id);

-- Allow admins and PCU hosts to view all invitations
CREATE POLICY "Admins can view all invitations."
  ON invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'pcu_host')
    )
  );

-- Allow admins and PCU hosts to update all invitations (for attendance confirmation)
CREATE POLICY "Admins can update all invitations."
  ON invitations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'pcu_host')
    )
  );

-- ================================================
-- VERIFY POLICIES WERE CREATED
-- ================================================

-- Run this to see all policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Run this to see all policies on invitations table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'invitations';
