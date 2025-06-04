-- Migration to add status column to mock_interviews table
-- Run this in your Supabase SQL editor if the table already exists

-- Add status column to existing mock_interviews table
ALTER TABLE mock_interviews 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';

-- Update existing records to have 'completed' status
UPDATE mock_interviews 
SET status = 'completed' 
WHERE status IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN mock_interviews.status IS 'Status of the interview session: completed, incomplete, or aborted';
