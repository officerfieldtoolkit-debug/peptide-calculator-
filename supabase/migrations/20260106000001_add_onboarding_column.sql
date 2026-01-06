-- Migration: Add onboarding_complete column to profiles table
-- This tracks whether a user has completed the onboarding wizard

-- Add the column if it doesn't exist
ALTER TABLE profiles 
    ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false;

-- Create an index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
    ON profiles(onboarding_complete) 
    WHERE onboarding_complete = false;

-- Comment for documentation
COMMENT ON COLUMN profiles.onboarding_complete IS 
    'Whether the user has completed the onboarding wizard (shown on first dashboard visit)';
