-- Fix Peptide Sciences Config
UPDATE public.vendors
SET scrape_config = jsonb_set(
    scrape_config,
    '{productSelector}',
    '".c-product-card"'
)
WHERE slug = 'peptide-sciences';

UPDATE public.vendors
SET scrape_config = jsonb_set(
    scrape_config,
    '{priceSelector}',
    '".pixel-addtocart span:last-child"'
)
WHERE slug = 'peptide-sciences';
