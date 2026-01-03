-- Disable PureRawz temporarily to save API calls
UPDATE vendors
SET is_active = false
WHERE slug = 'pure-rawz';
