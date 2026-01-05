-- Manage Vendors: Activate PureRawz, Deactivate Skye, Clean up others
-- Activate PureRawz
UPDATE public.vendors
SET is_active = true
WHERE slug = 'pure-rawz';

-- Deactivate Skye Peptides (User requested removal)
UPDATE public.vendors
SET is_active = false
WHERE slug = 'skye-peptides';

-- Remove Amino Asylum and Peptide Sciences permanently (since price tracking cascades)
DELETE FROM public.vendors
WHERE slug IN ('amino-asylum', 'peptide-sciences');
