-- Add theme and language preferences to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS theme_preference text DEFAULT 'dark',
ADD COLUMN IF NOT EXISTS language_preference text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"injection_reminders": true, "expiration_alerts": true, "weekly_reports": false, "price_alerts": false}'::jsonb;

-- Add comment
COMMENT ON COLUMN public.profiles.theme_preference IS 'User preferred theme: dark or light';
COMMENT ON COLUMN public.profiles.language_preference IS 'User preferred language: en, es, etc.';
COMMENT ON COLUMN public.profiles.notification_preferences IS 'JSON object containing notification settings';
