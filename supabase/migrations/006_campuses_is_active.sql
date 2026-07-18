-- Add is_active column to campuses table
ALTER TABLE campuses 
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Update existing records to be active
UPDATE campuses SET is_active = true;
