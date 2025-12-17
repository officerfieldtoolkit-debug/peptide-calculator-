-- Change body weight column from kg to lbs
-- Rename column for clarity
ALTER TABLE public.injections 
RENAME COLUMN body_weight_kg TO body_weight_lbs;

-- Update comment
COMMENT ON COLUMN public.injections.body_weight_lbs IS 'Optional body weight at time of injection in pounds (lbs)';
