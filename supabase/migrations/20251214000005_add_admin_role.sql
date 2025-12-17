-- Add admin role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Add comment
COMMENT ON COLUMN public.profiles.is_admin IS 'Whether the user has admin privileges';

-- Create a function to check if user is admin (for use in RLS policies)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create admin-only RLS policy for peptides table (admin can do anything)
-- Regular users can only read
DROP POLICY IF EXISTS "Admins can manage peptides" ON public.peptides;
CREATE POLICY "Admins can manage peptides" ON public.peptides
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Ensure anyone can still read peptides
DROP POLICY IF EXISTS "Anyone can view peptides" ON public.peptides;
CREATE POLICY "Anyone can view peptides" ON public.peptides
  FOR SELECT
  USING (true);
