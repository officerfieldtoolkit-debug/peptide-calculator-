-- Fix Forum and Reviews Relationships
-- This migration fixes the relationship issues between tables and profiles

-- ============================================
-- FIX FORUM TOPICS RELATIONSHIP
-- ============================================

-- Add a view to allow joining forum_topics with profiles
CREATE OR REPLACE VIEW forum_topics_with_profiles AS
SELECT 
    ft.*,
    p.email,
    p.full_name,
    p.avatar_url
FROM forum_topics ft
LEFT JOIN profiles p ON ft.user_id = p.id;

-- Grant permissions
GRANT SELECT ON forum_topics_with_profiles TO anon, authenticated;

-- ============================================
-- FIX FORUM POSTS RELATIONSHIP
-- ============================================

CREATE OR REPLACE VIEW forum_posts_with_profiles AS
SELECT 
    fp.*,
    p.email,
    p.full_name,
    p.avatar_url
FROM forum_posts fp
LEFT JOIN profiles p ON fp.user_id = p.id;

GRANT SELECT ON forum_posts_with_profiles TO anon, authenticated;

-- ============================================
-- FIX REVIEWS RELATIONSHIP  
-- ============================================

-- First ensure reviews table has proper columns
DO $$ 
BEGIN
    -- Check if peptide_name column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reviews' AND column_name = 'peptide_name') THEN
        ALTER TABLE reviews ADD COLUMN peptide_name TEXT;
    END IF;
END $$;

-- Create view for reviews with user info
CREATE OR REPLACE VIEW reviews_with_profiles AS
SELECT 
    r.id,
    r.user_id,
    r.peptide_name,
    r.rating,
    r.comment,
    r.created_at,
    r.updated_at,
    p.email,
    p.full_name,
    p.avatar_url
FROM reviews r
LEFT JOIN profiles p ON r.user_id = p.id;

GRANT SELECT ON reviews_with_profiles TO anon, authenticated;

-- ============================================
-- RLS POLICIES FOR VIEWS
-- ============================================

-- Enable RLS on base tables if not already
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Reviews: Anyone can read, users can write their own
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Anyone can view reviews') THEN
        CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can create own reviews') THEN
        CREATE POLICY "Users can create own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can update own reviews') THEN
        CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can delete own reviews') THEN
        CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_peptide ON reviews(peptide_name);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);
