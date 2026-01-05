-- Drop and Recreate RPC to handle return type change

DROP FUNCTION IF EXISTS public.get_peptide_prices(text);

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
    quantity_mg numeric,
    quantity_unit text,
    price_per_mg numeric,
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
        -- Fallback to constructed quantity string if the legacy text field is empty
        COALESCE(pp.quantity, (pp.quantity_mg || pp.quantity_unit)),
        pp.quantity_mg,
        pp.quantity_unit,
        pp.price_per_mg,
        pp.in_stock,
        pp.last_verified_at
    FROM public.peptide_prices pp
    JOIN public.vendors v ON pp.vendor_id = v.id
    WHERE pp.peptide_slug = p_peptide_slug
      AND v.is_active = true
    ORDER BY 
        -- Sort by price per mg if available, otherwise by price
        CASE WHEN pp.price_per_mg IS NOT NULL THEN 0 ELSE 1 END,
        pp.price_per_mg ASC,
        pp.price ASC;
END;
$$ LANGUAGE plpgsql STABLE SET search_path = public;
