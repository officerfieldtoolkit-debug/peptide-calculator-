-- Force update all vendors to be active and have correct configs
-- This ensures no mismatched state

-- 1. Biotech Peptides
UPDATE vendors SET 
  is_active = true,
  website_url = 'https://biotechpeptides.com',
  scrape_config = '{"productSelector": "li.product", "priceSelector": ".price", "nameSelector": "h2.woocommerce-loop-product__title", "searchUrl": "https://biotechpeptides.com/shop/"}'::jsonb
WHERE slug = 'biotech-peptides';

-- 2. Amino Asylum
UPDATE vendors SET 
  is_active = true,
  website_url = 'https://aminoasylumllc.com',
  scrape_config = '{"productSelector": "li.product", "priceSelector": ".price .woocommerce-Price-amount bdi, .price bdi", "nameSelector": "h2.woocommerce-loop-product__title, .woocommerce-loop-product__title", "searchUrl": "https://aminoasylumllc.com/product-category/peptides/"}'::jsonb
WHERE slug = 'amino-asylum';

-- 3. Swiss Chems
UPDATE vendors SET 
  is_active = true,
  website_url = 'https://swisschems.is',
  scrape_config = '{"productSelector": "li.product", "priceSelector": ".price .woocommerce-Price-amount bdi, .price bdi", "nameSelector": "h2.woocommerce-loop-product__title", "searchUrl": "https://swisschems.is/peptides"}'::jsonb
WHERE slug = 'swiss-chems';

-- 4. Peptide Sciences (Requires Proxy)
UPDATE vendors SET 
  is_active = true,
  website_url = 'https://www.peptidesciences.com',
  scrape_config = '{"productSelector": ".product-item-info", "priceSelector": ".price", "nameSelector": ".product-item-link", "searchUrl": "https://www.peptidesciences.com/peptides"}'::jsonb
WHERE slug = 'peptide-sciences';

-- 5. Paradigm Peptides (Requires Proxy)
UPDATE vendors SET 
  is_active = true,
  website_url = 'https://paradigmpeptides.com',
  scrape_config = '{"productSelector": "li.product", "priceSelector": ".price", "nameSelector": ".woocommerce-loop-product__title", "searchUrl": "https://paradigmpeptides.com/product-category/peptides/"}'::jsonb
WHERE slug = 'paradigm-peptides';
