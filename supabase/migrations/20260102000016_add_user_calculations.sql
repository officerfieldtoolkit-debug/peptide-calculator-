-- Create table for storing user reconstitution calculations
CREATE TABLE IF NOT EXISTS public.user_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    peptide_name TEXT NOT NULL,
    vial_amount NUMERIC NOT NULL,
    water_amount NUMERIC NOT NULL,
    dose_amount NUMERIC NOT NULL,
    dose_unit TEXT NOT NULL DEFAULT 'mcg',
    syringe_type TEXT NOT NULL DEFAULT 'u100',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_calculations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own calculations"
    ON public.user_calculations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calculations"
    ON public.user_calculations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculations"
    ON public.user_calculations FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_user_calculations_user_id ON public.user_calculations(user_id);
