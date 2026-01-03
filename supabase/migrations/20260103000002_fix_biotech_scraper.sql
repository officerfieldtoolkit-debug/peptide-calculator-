-- Fix Biotech Peptides scraper configuration
-- The .title selector doesn't exist, use WooCommerce selectors instead

UPDATE vendors
SET scrape_config = '{
  "productSelector": "li.product",
  "priceSelector": ".price",
  "nameSelector": "h2.woocommerce-loop-product__title",
  "searchUrl": "https://biotechpeptides.com/buy-peptides/"
}'::jsonb
WHERE slug = 'biotech-peptides';
