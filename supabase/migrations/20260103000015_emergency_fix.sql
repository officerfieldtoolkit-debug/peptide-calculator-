-- Consolidated Fixes for All Vendors (Peptide Sciences, Amino Asylum, BioTech)

-- Fix Peptide Sciences (Magento style)
UPDATE public.vendors
SET scrape_config = jsonb_set(
    jsonb_set(
        jsonb_set(
            scrape_config,
            '{searchUrl}',
            '"https://www.peptidesciences.com/peptides"'
        ),
        '{productSelector}',
        '".product-item-info"'
    ),
    '{nameSelector}',
    '".product-item-link"'
)
WHERE slug = 'peptide-sciences';

-- Fix BioTech Peptides (Use specific category URL)
UPDATE public.vendors
SET scrape_config = jsonb_set(
    scrape_config,
    '{searchUrl}',
    '"https://biotechpeptides.com/product-category/peptides/"'
)
WHERE slug = 'biotech-peptides';

-- Fix Amino Asylum (Use Research Chemicals category & Flatsome selectors)
UPDATE public.vendors
SET scrape_config = jsonb_set(
    jsonb_set(
        scrape_config,
        '{productSelector}',
        '".product-small, li.product"'
    ),
    '{searchUrl}',
    '"https://aminoasylumllc.com/product-category/research-chemicals/"'
)
WHERE slug = 'amino-asylum';
