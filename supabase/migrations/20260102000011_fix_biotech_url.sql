-- Migration: Fix BioTech Peptides URL
-- Run: supabase db push

UPDATE public.vendors 
SET scrape_config = '{"productSelector": ".product", "priceSelector": ".price", "nameSelector": ".title", "searchUrl": "https://biotechpeptides.com/buy-peptides/"}'::jsonb
WHERE slug = 'biotech-peptides';
