-- Remove Amino Asylum and Peptide Sciences (disable them)
UPDATE public.vendors
SET is_active = false
WHERE slug IN ('amino-asylum', 'peptide-sciences');

-- Add Core Peptides
INSERT INTO public.vendors (name, slug, website_url, logo_emoji, is_active, scrape_config)
VALUES (
    'Core Peptides',
    'core-peptides',
    'https://www.corepeptides.com',
    '🧪',
    true,
    '{
        "searchUrl": "https://www.corepeptides.com/peptides/",
        "productSelector": "li.product",
        "nameSelector": ".woocommerce-loop-product__title",
        "priceSelector": ".price"
    }'
)
ON CONFLICT (slug) DO UPDATE
SET is_active = true,
    scrape_config = EXCLUDED.scrape_config;

-- Add Skye Peptides
INSERT INTO public.vendors (name, slug, website_url, logo_emoji, is_active, scrape_config)
VALUES (
    'Skye Peptides',
    'skye-peptides',
    'https://www.skyepeptides.com',
    '☁️',
    true,
    '{
        "searchUrl": "https://www.skyepeptides.com/shop/",
        "productSelector": "div.product-grid-item, li.product",
        "nameSelector": ".product-title, .woocommerce-loop-product__title",
        "priceSelector": ".price"
    }'
)
ON CONFLICT (slug) DO UPDATE
SET is_active = true,
    scrape_config = EXCLUDED.scrape_config;
