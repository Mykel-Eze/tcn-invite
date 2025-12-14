-- FIX RLS POLICY FOR PROFILES
-- Drop the existing insert policy
drop policy if exists "Users can insert their own profile." on profiles;

-- Create a more permissive insert policy that allows users to create their profile during signup
-- This allows authenticated users to insert a profile with their own ID
create policy "Users can insert their own profile." on profiles
  for insert
  with check (auth.uid() = id);

-- Also add an update policy so users can update their own profile
create policy "Users can update own profile." on profiles
  for update
  using (auth.uid() = id);

-- Add policies for admins to view all invitations and update them
create policy "Admins can view all invitations." on invitations
  for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'pcu_host')
    )
  );

create policy "Admins can update all invitations." on invitations
  for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'pcu_host')
    )
  );

-- Add policy for admins to update user roles
create policy "Admins can update profiles." on profiles
  for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
