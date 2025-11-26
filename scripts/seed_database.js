import { createClient } from '@supabase/supabase-js';
import { PEPTIDE_DATABASE } from '../src/data/peptideDatabase.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
    console.log('Starting database seed...');

    // Convert object to array
    const peptides = Object.values(PEPTIDE_DATABASE).map(p => ({
        name: p.name,
        category: p.category,
        half_life_hours: parseFloat(p.halfLife) || 0,
        description: p.description,
        benefits: p.benefits,
        side_effects: p.sideEffects,
        warnings: p.warnings || [],
        dosage_protocols: p.protocols || {}
    }));

    console.log(`Found ${peptides.length} peptides to insert.`);

    const { data, error } = await supabase
        .from('peptides')
        .upsert(peptides, { onConflict: 'name' })
        .select();

    if (error) {
        console.error('Error seeding database:', error);
    } else {
        console.log('Successfully seeded database!');
        console.log(`Inserted/Updated ${data.length} records.`);
    }
}

seedDatabase();
