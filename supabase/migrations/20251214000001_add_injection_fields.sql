-- Add missing columns to injections table for full tracking support
-- Run this migration after the initial schema is set up

-- Add injection_site column to track where the injection was administered
ALTER TABLE public.injections 
ADD COLUMN IF NOT EXISTS injection_site text DEFAULT 'Abdomen';

-- Add dosage_value to store the original numeric value entered by user
ALTER TABLE public.injections 
ADD COLUMN IF NOT EXISTS dosage_value numeric;

-- Add dosage_unit to store the unit type (mg, mcg, IU)
ALTER TABLE public.injections 
ADD COLUMN IF NOT EXISTS dosage_unit text DEFAULT 'mg';

-- Add body_weight_kg for optional weight tracking
ALTER TABLE public.injections 
ADD COLUMN IF NOT EXISTS body_weight_kg numeric;

-- Update existing rows to set dosage_value from dosage_mcg (convert mcg to mg)
UPDATE public.injections 
SET dosage_value = dosage_mcg / 1000, dosage_unit = 'mcg'
WHERE dosage_value IS NULL;

-- Add comment explaining the columns
COMMENT ON COLUMN public.injections.injection_site IS 'Body location of injection (Abdomen, Thigh, Arm, Glute)';
COMMENT ON COLUMN public.injections.dosage_value IS 'Original dosage value as entered by user';
COMMENT ON COLUMN public.injections.dosage_unit IS 'Unit of measurement (mg, mcg, IU)';
COMMENT ON COLUMN public.injections.body_weight_kg IS 'Optional body weight at time of injection in kg';
