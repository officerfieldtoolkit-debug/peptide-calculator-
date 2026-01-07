-- Database schema for new features
-- Run this in Supabase SQL Editor

-- Blood Work Tracking Table
CREATE TABLE IF NOT EXISTS public.blood_work (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  test_date date NOT NULL,
  lab_name text,
  values jsonb NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.blood_work ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blood work"
  ON blood_work FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blood work"
  ON blood_work FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blood work"
  ON blood_work FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blood work"
  ON blood_work FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for blood work
CREATE INDEX IF NOT EXISTS idx_blood_work_user_id ON public.blood_work(user_id);
CREATE INDEX IF NOT EXISTS idx_blood_work_test_date ON public.blood_work(test_date);

-- Vendor Reviews Table
CREATE TABLE IF NOT EXISTS public.vendor_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  vendor_id text NOT NULL,
  ratings jsonb NOT NULL DEFAULT '{}',
  overall_rating numeric(2,1) CHECK (overall_rating >= 1 AND overall_rating <= 5),
  title text NOT NULL,
  content text NOT NULL,
  peptides_ordered text,
  would_recommend boolean DEFAULT true,
  helpful_count integer DEFAULT 0,
  verified_purchase boolean DEFAULT false,
  status text DEFAULT 'published' CHECK (status IN ('pending', 'published', 'flagged', 'removed')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.vendor_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view published reviews
CREATE POLICY "Published reviews are viewable by everyone"
  ON vendor_reviews FOR SELECT
  USING (status = 'published');

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews"
  ON vendor_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own vendor reviews"
  ON vendor_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own vendor reviews"
  ON vendor_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for vendor reviews
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_user_id ON public.vendor_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_vendor_id ON public.vendor_reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_status ON public.vendor_reviews(status);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_overall_rating ON public.vendor_reviews(overall_rating);

-- Review Helpful Votes Table (to track who voted)
CREATE TABLE IF NOT EXISTS public.review_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  review_id uuid REFERENCES public.vendor_reviews(id) ON DELETE CASCADE NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, review_id)
);

ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all votes"
  ON review_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own votes"
  ON review_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON review_votes FOR DELETE
  USING (auth.uid() = user_id);

-- User Subscriptions Table (for premium features)
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'pro')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can modify subscriptions (for webhook processing)
CREATE POLICY "Service role can manage subscriptions"
  ON user_subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- Index for subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);

-- Titration Plans Table (user-saved plans)
CREATE TABLE IF NOT EXISTS public.titration_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  drug_name text NOT NULL,
  protocol_name text NOT NULL,
  start_date date NOT NULL,
  current_step integer DEFAULT 0,
  current_weight numeric,
  goal_weight numeric,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.titration_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own titration plans"
  ON titration_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own titration plans"
  ON titration_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own titration plans"
  ON titration_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own titration plans"
  ON titration_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Index for titration plans
CREATE INDEX IF NOT EXISTS idx_titration_plans_user_id ON public.titration_plans(user_id);

-- Function to check if user has premium subscription
CREATE OR REPLACE FUNCTION public.is_premium(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_subscriptions
    WHERE user_id = check_user_id
    AND plan IN ('premium', 'pro')
    AND status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW())
  );
END;
$$;

-- Function to increment helpful count
CREATE OR REPLACE FUNCTION public.increment_helpful_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.vote_type = 'helpful' THEN
    UPDATE vendor_reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_helpful_vote
  AFTER INSERT ON review_votes
  FOR EACH ROW
  EXECUTE FUNCTION increment_helpful_count();

-- Function to decrement helpful count on delete
CREATE OR REPLACE FUNCTION public.decrement_helpful_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.vote_type = 'helpful' THEN
    UPDATE vendor_reviews SET helpful_count = GREATEST(0, helpful_count - 1) WHERE id = OLD.review_id;
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER on_helpful_vote_removed
  BEFORE DELETE ON review_votes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_helpful_count();
