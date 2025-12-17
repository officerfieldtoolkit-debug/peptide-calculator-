-- Add subscription and notification columns to profiles
-- For premium features and email preferences

-- Add subscription fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add notification preference fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS reminder_time TIME;

-- Create index for subscription lookups
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_tier);

-- Comment on columns
COMMENT ON COLUMN profiles.subscription_tier IS 'User subscription tier: free, premium, or pro';
COMMENT ON COLUMN profiles.subscription_expires_at IS 'When the current subscription expires';
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN profiles.email_notifications IS 'Whether user wants email notifications';
COMMENT ON COLUMN profiles.push_notifications IS 'Whether user wants push notifications';
COMMENT ON COLUMN profiles.reminder_time IS 'Preferred daily reminder time';

SELECT 'Subscription and notification fields added to profiles!' as status;
