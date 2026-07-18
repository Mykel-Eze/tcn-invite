-- Enable RLS on campuses table
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so everyone can see the list of campuses)
CREATE POLICY "Allow public read access" 
ON campuses FOR SELECT 
USING (true);

-- Allow admins to update campuses (specifically for is_active toggle)
CREATE POLICY "Allow admins to update campuses" 
ON campuses FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow admins to insert new campuses (future proofing)
CREATE POLICY "Allow admins to insert campuses" 
ON campuses FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
