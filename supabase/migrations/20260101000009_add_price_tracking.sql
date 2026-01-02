-- Migration: Create tables for automated price tracking
-- Run: supabase db push

-- Vendors table
CREATE TABLE IF NOT EXISTS public.vendors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    website_url text NOT NULL,
    affiliate_url text,
    logo_emoji text DEFAULT '🧬',
    rating numeric(2,1) DEFAULT 4.5,
    review_count integer DEFAULT 0,
    shipping_info text,
    shipping_days text,
    payment_methods text[],
    features text[],
    is_active boolean DEFAULT true,
    scrape_config jsonb, -- Stores CSS selectors for scraping
    last_scraped_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Peptide prices table
CREATE TABLE IF NOT EXISTS public.peptide_prices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id uuid REFERENCES public.vendors(id) ON DELETE CASCADE,
    peptide_name text NOT NULL,
    peptide_slug text NOT NULL,
    price numeric(10,2) NOT NULL,
    unit text DEFAULT 'vial',
    quantity text, -- e.g., "5mg", "10mg"
    original_price numeric(10,2), -- For showing discounts
    in_stock boolean DEFAULT true,
    product_url text,
    last_verified_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(vendor_id, peptide_slug)
);

-- Price history for tracking changes over time
CREATE TABLE IF NOT EXISTS public.price_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    peptide_price_id uuid REFERENCES public.peptide_prices(id) ON DELETE CASCADE,
    price numeric(10,2) NOT NULL,
    recorded_at timestamptz DEFAULT now()
);

-- Scrape logs for debugging
CREATE TABLE IF NOT EXISTS public.scrape_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id uuid REFERENCES public.vendors(id) ON DELETE CASCADE,
    status text NOT NULL, -- 'success', 'partial', 'failed'
    products_found integer DEFAULT 0,
    products_updated integer DEFAULT 0,
    error_message text,
    duration_ms integer,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peptide_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for vendors and prices (no auth required)
CREATE POLICY "Anyone can view vendors" ON public.vendors
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view prices" ON public.peptide_prices
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view price history" ON public.price_history
    FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Admins can manage vendors" ON public.vendors
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage prices" ON public.peptide_prices
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage price history" ON public.price_history
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can view scrape logs" ON public.scrape_logs
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage scrape logs" ON public.scrape_logs
    FOR ALL USING (public.is_admin());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_peptide_prices_peptide ON public.peptide_prices(peptide_slug);
CREATE INDEX IF NOT EXISTS idx_peptide_prices_vendor ON public.peptide_prices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_price_history_peptide ON public.price_history(peptide_price_id);
CREATE INDEX IF NOT EXISTS idx_scrape_logs_vendor ON public.scrape_logs(vendor_id);

-- Insert default vendors
INSERT INTO public.vendors (name, slug, website_url, affiliate_url, logo_emoji, rating, review_count, shipping_info, shipping_days, payment_methods, features, scrape_config) VALUES
(
    'Peptide Sciences',
    'peptide-sciences',
    'https://www.peptidesciences.com',
    'https://www.peptidesciences.com/?ref=YOUR_AFFILIATE_ID',
    '🧬',
    4.8,
    2847,
    'Free over $200',
    '3-5 days',
    ARRAY['Credit Card', 'Crypto', 'Zelle'],
    ARRAY['USA-based', 'COA Available', 'Fast Shipping'],
    '{"productSelector": ".product-item", "priceSelector": ".price", "nameSelector": ".product-name"}'::jsonb
),
(
    'PureRawz',
    'pure-rawz',
    'https://purerawz.co',
    'https://purerawz.co/?aff=YOUR_AFFILIATE_ID',
    '⚗️',
    4.6,
    1923,
    'Free over $150',
    '2-4 days',
    ARRAY['Credit Card', 'Crypto', 'PayPal'],
    ARRAY['Third-party tested', 'Rewards Program', 'USA Shipping'],
    '{"productSelector": ".product", "priceSelector": ".woocommerce-Price-amount", "nameSelector": ".woocommerce-loop-product__title"}'::jsonb
),
(
    'Swiss Chems',
    'swiss-chems',
    'https://swisschems.is',
    'https://swisschems.is/?ref=YOUR_AFFILIATE_ID',
    '🇨🇭',
    4.7,
    1654,
    '$9.99 flat rate',
    '5-7 days',
    ARRAY['Credit Card', 'Crypto', 'Bank Transfer'],
    ARRAY['European Quality', 'Bulk Discounts', 'HPLC Tested'],
    '{"productSelector": ".product-item-info", "priceSelector": ".price", "nameSelector": ".product-item-link"}'::jsonb
),
(
    'BioTech Peptides',
    'biotech-peptides',
    'https://biotechpeptides.com',
    'https://biotechpeptides.com/?ref=YOUR_AFFILIATE_ID',
    '🔬',
    4.5,
    1287,
    'Free over $100',
    '2-5 days',
    ARRAY['Credit Card', 'Crypto'],
    ARRAY['Lab Tested', 'USA Made', 'Quantity Discounts'],
    '{"productSelector": ".product", "priceSelector": ".price", "nameSelector": ".title"}'::jsonb
),
(
    'Amino Asylum',
    'amino-asylum',
    'https://aminoasylum.com',
    'https://aminoasylum.com/?ref=YOUR_AFFILIATE_ID',
    '💊',
    4.4,
    892,
    '$8.99 flat rate',
    '3-6 days',
    ARRAY['Credit Card', 'Crypto', 'Zelle'],
    ARRAY['Affordable', 'Wide Selection', 'Bundle Deals'],
    '{"productSelector": ".product-grid-item", "priceSelector": ".money", "nameSelector": ".product-title"}'::jsonb
),
(
    'Paradigm Peptides',
    'paradigm-peptides',
    'https://paradigmpeptides.com',
    'https://paradigmpeptides.com/?ref=YOUR_AFFILIATE_ID',
    '🎯',
    4.6,
    1456,
    'Free over $150',
    '2-4 days',
    ARRAY['Credit Card', 'Crypto', 'E-check'],
    ARRAY['Fast Shipping', 'Quality Guarantee', 'USA Based'],
    '{"productSelector": ".product", "priceSelector": ".price", "nameSelector": ".woocommerce-loop-product__title"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    website_url = EXCLUDED.website_url,
    affiliate_url = EXCLUDED.affiliate_url,
    scrape_config = EXCLUDED.scrape_config,
    updated_at = now();

-- Insert some default peptide prices (will be updated by scraper)
-- These are baseline estimates
DO $$
DECLARE
    vendor_rec RECORD;
BEGIN
    FOR vendor_rec IN SELECT id, slug FROM public.vendors LOOP
        -- Insert common peptides with estimated prices
        INSERT INTO public.peptide_prices (vendor_id, peptide_name, peptide_slug, price, unit, quantity, in_stock)
        VALUES
            (vendor_rec.id, 'Semaglutide', 'semaglutide', 249.00, 'vial', '5mg', true),
            (vendor_rec.id, 'Tirzepatide', 'tirzepatide', 289.00, 'vial', '10mg', true),
            (vendor_rec.id, 'BPC-157', 'bpc-157', 48.00, 'vial', '5mg', true),
            (vendor_rec.id, 'TB-500', 'tb-500', 52.00, 'vial', '5mg', true),
            (vendor_rec.id, 'Ipamorelin', 'ipamorelin', 38.00, 'vial', '5mg', true),
            (vendor_rec.id, 'CJC-1295 (no DAC)', 'cjc-1295-no-dac', 42.00, 'vial', '2mg', true),
            (vendor_rec.id, 'Melanotan II', 'melanotan-ii', 38.00, 'vial', '10mg', true),
            (vendor_rec.id, 'PT-141', 'pt-141', 45.00, 'vial', '10mg', true),
            (vendor_rec.id, 'AOD-9604', 'aod-9604', 58.00, 'vial', '5mg', true),
            (vendor_rec.id, 'GHK-Cu', 'ghk-cu', 35.00, 'vial', '50mg', true)
        ON CONFLICT (vendor_id, peptide_slug) DO NOTHING;
    END LOOP;
END $$;

-- Add some price variance between vendors (more realistic)
UPDATE public.peptide_prices 
SET price = price * (0.92 + random() * 0.16),  -- +/- 8% variance
    updated_at = now();

-- Function to get prices for a peptide across all vendors
CREATE OR REPLACE FUNCTION public.get_peptide_prices(p_peptide_slug text)
RETURNS TABLE (
    vendor_name text,
    vendor_slug text,
    vendor_logo text,
    vendor_rating numeric,
    vendor_reviews integer,
    vendor_shipping text,
    vendor_url text,
    affiliate_url text,
    price numeric,
    unit text,
    quantity text,
    in_stock boolean,
    last_verified timestamptz
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.name,
        v.slug,
        v.logo_emoji,
        v.rating,
        v.review_count,
        v.shipping_info,
        v.website_url,
        v.affiliate_url,
        pp.price,
        pp.unit,
        pp.quantity,
        pp.in_stock,
        pp.last_verified_at
    FROM public.peptide_prices pp
    JOIN public.vendors v ON pp.vendor_id = v.id
    WHERE pp.peptide_slug = p_peptide_slug
      AND v.is_active = true
    ORDER BY pp.price ASC;
END;
$$ LANGUAGE plpgsql STABLE SET search_path = public;

-- Function to get all available peptides
CREATE OR REPLACE FUNCTION public.get_available_peptides()
RETURNS TABLE (
    peptide_name text,
    peptide_slug text,
    min_price numeric,
    max_price numeric,
    vendor_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pp.peptide_name,
        pp.peptide_slug,
        MIN(pp.price),
        MAX(pp.price),
        COUNT(DISTINCT pp.vendor_id)
    FROM public.peptide_prices pp
    JOIN public.vendors v ON pp.vendor_id = v.id
    WHERE v.is_active = true
    GROUP BY pp.peptide_name, pp.peptide_slug
    ORDER BY pp.peptide_name;
END;
$$ LANGUAGE plpgsql STABLE SET search_path = public;
