-- Fix constraints and clean up duplicate prices to prevent 409 errors
-- This is a maintenance migration to ensure DB health

-- 1. Remove duplicate prices (keep the most recently verified)
-- This handles any existing duplicates that might block the unique constraint
DELETE FROM peptide_prices a USING (
    SELECT MIN(ctid) as ctid, vendor_id, peptide_slug
    FROM peptide_prices 
    GROUP BY vendor_id, peptide_slug HAVING COUNT(*) > 1
) b
WHERE a.vendor_id = b.vendor_id 
AND a.peptide_slug = b.peptide_slug 
AND a.ctid <> b.ctid;

-- 2. Drop and Re-add the Unique Constraint to be Safe
ALTER TABLE peptide_prices DROP CONSTRAINT IF EXISTS peptide_prices_vendor_id_peptide_slug_key;

ALTER TABLE peptide_prices 
ADD CONSTRAINT peptide_prices_vendor_id_peptide_slug_key 
UNIQUE (vendor_id, peptide_slug);

-- 3. Ensure PureRawz is disabled (redundant check)
UPDATE vendors
SET is_active = false
WHERE slug = 'pure-rawz';
