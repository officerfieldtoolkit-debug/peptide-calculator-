/**
 * Supabase Edge Function: scrape-prices
 * 
 * Scrapes peptide prices from vendor websites and updates the database.
 * Run periodically via cron or manually triggered from admin panel.
 * 
 * Usage:
 *   POST /functions/v1/scrape-prices
 *   Body: { "vendor_slug": "peptide-sciences" } // optional, scrapes all if omitted
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Vendor {
    id: string;
    name: string;
    slug: string;
    website_url: string;
    scrape_config: {
        productSelector: string;
        priceSelector: string;
        nameSelector: string;
        searchUrl?: string;
        peptidePages?: Record<string, string>;
    };
}

interface ScrapedProduct {
    name: string;
    price: number;
    inStock: boolean;
    url?: string;
}

// Common peptides to search for
const TARGET_PEPTIDES = [
    { name: 'Semaglutide', slug: 'semaglutide', searchTerms: ['semaglutide', 'ozempic', 'wegovy'] },
    { name: 'Tirzepatide', slug: 'tirzepatide', searchTerms: ['tirzepatide', 'mounjaro'] },
    { name: 'Retatrutide', slug: 'retatrutide', searchTerms: ['retatrutide'] },
    { name: 'BPC-157', slug: 'bpc-157', searchTerms: ['bpc-157', 'bpc157', 'body protection compound'] },
    { name: 'TB-500', slug: 'tb-500', searchTerms: ['tb-500', 'tb500', 'thymosin beta'] },
    { name: 'Ipamorelin', slug: 'ipamorelin', searchTerms: ['ipamorelin'] },
    { name: 'CJC-1295 (no DAC)', slug: 'cjc-1295-no-dac', searchTerms: ['cjc-1295', 'cjc1295', 'mod grf'] },
    { name: 'CJC-1295 (DAC)', slug: 'cjc-1295-dac', searchTerms: ['cjc-1295 dac', 'cjc1295 dac'] },
    { name: 'Melanotan II', slug: 'melanotan-ii', searchTerms: ['melanotan ii', 'melanotan 2', 'mt2'] },
    { name: 'PT-141', slug: 'pt-141', searchTerms: ['pt-141', 'pt141', 'bremelanotide'] },
    { name: 'AOD-9604', slug: 'aod-9604', searchTerms: ['aod-9604', 'aod9604'] },
    { name: 'GHK-Cu', slug: 'ghk-cu', searchTerms: ['ghk-cu', 'ghkcu', 'copper peptide'] },
    { name: 'GHRP-2', slug: 'ghrp-2', searchTerms: ['ghrp-2', 'ghrp2'] },
    { name: 'GHRP-6', slug: 'ghrp-6', searchTerms: ['ghrp-6', 'ghrp6'] },
    { name: 'Hexarelin', slug: 'hexarelin', searchTerms: ['hexarelin'] },
    { name: 'MK-677', slug: 'mk-677', searchTerms: ['mk-677', 'mk677', 'ibutamoren'] },
    { name: 'Semax', slug: 'semax', searchTerms: ['semax'] },
    { name: 'Selank', slug: 'selank', searchTerms: ['selank'] },
    { name: 'Epithalon', slug: 'epithalon', searchTerms: ['epithalon', 'epitalon'] },
    { name: 'MOTS-c', slug: 'mots-c', searchTerms: ['mots-c', 'motsc'] },
];

/**
 * Extract price from text (handles various formats)
 */
function extractPrice(text: string): number | null {
    if (!text) return null;

    // Remove currency symbols and whitespace
    const cleaned = text.replace(/[^0-9.,]/g, '');

    // Handle comma as decimal separator
    const normalized = cleaned.replace(',', '.');

    // Parse the number
    const price = parseFloat(normalized);

    return isNaN(price) ? null : price;
}

/**
 * Normalize peptide name for matching
 */
function normalizeName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Find matching peptide from our list
 */
function findMatchingPeptide(productName: string): { name: string; slug: string } | null {
    const normalizedProduct = normalizeName(productName);

    for (const peptide of TARGET_PEPTIDES) {
        for (const term of peptide.searchTerms) {
            if (normalizedProduct.includes(normalizeName(term))) {
                return { name: peptide.name, slug: peptide.slug };
            }
        }
    }

    return null;
}

/**
 * Scrape a vendor's website for peptide prices
 */
async function scrapeVendor(vendor: Vendor): Promise<{
    products: ScrapedProduct[];
    errors: string[];
}> {
    const products: ScrapedProduct[] = [];
    const errors: string[] = [];

    try {
        // Fetch the vendor's peptide category page
        const searchUrl = vendor.scrape_config?.searchUrl || `${vendor.website_url}/peptides`;

        console.log(`Fetching: ${searchUrl}`);

        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();

        // Parse HTML using deno-dom
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        if (!doc) {
            throw new Error('Failed to parse HTML');
        }

        // Find all product elements
        const config = vendor.scrape_config;
        const productElements = doc.querySelectorAll(config.productSelector);

        console.log(`Found ${productElements.length} product elements`);

        for (const element of productElements) {
            try {
                // Extract product name
                const nameEl = element.querySelector(config.nameSelector);
                const name = nameEl?.textContent?.trim();

                if (!name) continue;

                // Check if this is a peptide we're tracking
                const matchedPeptide = findMatchingPeptide(name);
                if (!matchedPeptide) continue;

                // Extract price
                const priceEl = element.querySelector(config.priceSelector);
                const priceText = priceEl?.textContent || '';
                const price = extractPrice(priceText);

                if (!price || price <= 0 || price > 1000) continue; // Sanity check

                // Check stock status
                const outOfStockEl = element.querySelector('.out-of-stock, .soldout, [class*="unavailable"]');
                const inStock = !outOfStockEl;

                products.push({
                    name: matchedPeptide.name,
                    price,
                    inStock,
                });

                console.log(`Found: ${matchedPeptide.name} - $${price}`);
            } catch (err) {
                errors.push(`Error parsing product: ${err.message}`);
            }
        }
    } catch (err) {
        errors.push(`Failed to scrape ${vendor.name}: ${err.message}`);
        console.error(`Error scraping ${vendor.name}:`, err);
    }

    return { products, errors };
}

/**
 * Update prices in the database
 */
async function updatePrices(
    supabase: ReturnType<typeof createClient>,
    vendorId: string,
    products: ScrapedProduct[]
): Promise<number> {
    let updatedCount = 0;

    for (const product of products) {
        const peptideSlug = TARGET_PEPTIDES.find(p => p.name === product.name)?.slug;
        if (!peptideSlug) continue;

        // Upsert the price
        const { error } = await supabase
            .from('peptide_prices')
            .upsert({
                vendor_id: vendorId,
                peptide_name: product.name,
                peptide_slug: peptideSlug,
                price: product.price,
                in_stock: product.inStock,
                last_verified_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'vendor_id,peptide_slug',
            });

        if (!error) {
            updatedCount++;

            // Log price history
            const { data: priceRecord } = await supabase
                .from('peptide_prices')
                .select('id')
                .eq('vendor_id', vendorId)
                .eq('peptide_slug', peptideSlug)
                .single();

            if (priceRecord) {
                await supabase.from('price_history').insert({
                    peptide_price_id: priceRecord.id,
                    price: product.price,
                });
            }
        }
    }

    return updatedCount;
}

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const startTime = Date.now();

    try {
        // Verify authorization
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'Missing authorization header' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Create Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Parse request body
        let vendorSlug: string | null = null;
        try {
            const body = await req.json();
            vendorSlug = body?.vendor_slug || null;
        } catch {
            // No body or invalid JSON, scrape all vendors
        }

        // Get vendors to scrape
        let query = supabase.from('vendors').select('*').eq('is_active', true);
        if (vendorSlug) {
            query = query.eq('slug', vendorSlug);
        }

        const { data: vendors, error: vendorError } = await query;

        if (vendorError) {
            throw new Error(`Failed to fetch vendors: ${vendorError.message}`);
        }

        if (!vendors || vendors.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No vendors found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Scrape each vendor
        const results = [];

        for (const vendor of vendors) {
            console.log(`\n--- Scraping ${vendor.name} ---`);

            const scrapeStart = Date.now();
            const { products, errors } = await scrapeVendor(vendor as Vendor);
            const scrapeDuration = Date.now() - scrapeStart;

            // Update prices in database
            const updatedCount = await updatePrices(supabase, vendor.id, products);

            // Log the scrape
            const status = errors.length === 0 ? 'success' : (products.length > 0 ? 'partial' : 'failed');
            await supabase.from('scrape_logs').insert({
                vendor_id: vendor.id,
                status,
                products_found: products.length,
                products_updated: updatedCount,
                error_message: errors.length > 0 ? errors.join('; ') : null,
                duration_ms: scrapeDuration,
            });

            // Update vendor's last_scraped_at
            await supabase
                .from('vendors')
                .update({ last_scraped_at: new Date().toISOString() })
                .eq('id', vendor.id);

            results.push({
                vendor: vendor.name,
                status,
                productsFound: products.length,
                productsUpdated: updatedCount,
                durationMs: scrapeDuration,
                errors: errors.length > 0 ? errors : undefined,
            });

            // Rate limiting: wait between vendors
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const totalDuration = Date.now() - startTime;

        return new Response(
            JSON.stringify({
                success: true,
                vendorsScraped: results.length,
                totalDurationMs: totalDuration,
                results,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        console.error('Scrape error:', err);

        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
