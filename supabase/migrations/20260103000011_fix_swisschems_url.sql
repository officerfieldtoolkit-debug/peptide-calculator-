-- Update Swiss Chems URL to the correct category page
UPDATE public.vendors
SET scrape_config = jsonb_set(
    scrape_config,
    '{searchUrl}',
    '"https://swisschems.is/product-category/peptides/"'
)
WHERE slug = 'swiss-chems';

-- Also update selectors just in case they need to be more robust
UPDATE public.vendors
SET scrape_config = jsonb_set(
    scrape_config, 
    '{productSelector}', 
    '"li.product"'
)
WHERE slug = 'swiss-chems';
