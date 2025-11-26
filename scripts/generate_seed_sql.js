import { PEPTIDE_DATABASE } from '../src/data/peptideDatabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeText(str) {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

function formatArray(arr) {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return "'{}'";
    // Format as ARRAY['item1', 'item2']
    const items = arr.map(item => `'${item.replace(/'/g, "''")}'`).join(',');
    return `ARRAY[${items}]`;
}

function formatJson(obj) {
    if (!obj) return "'{}'";
    return `'${JSON.stringify(obj).replace(/'/g, "''")}'`;
}

function generateSql() {
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

    let sql = `INSERT INTO public.peptides (name, category, half_life_hours, description, benefits, side_effects, warnings, dosage_protocols)\nVALUES\n`;

    const values = peptides.map(p => {
        return `(
    ${escapeText(p.name)},
    ${escapeText(p.category)},
    ${p.half_life_hours},
    ${escapeText(p.description)},
    ${formatArray(p.benefits)},
    ${formatArray(p.side_effects)},
    ${formatArray(p.warnings)},
    ${formatJson(p.dosage_protocols)}
  )`;
    });

    sql += values.join(',\n') + '\nON CONFLICT (name) DO UPDATE SET\n' +
        'category = EXCLUDED.category,\n' +
        'half_life_hours = EXCLUDED.half_life_hours,\n' +
        'description = EXCLUDED.description,\n' +
        'benefits = EXCLUDED.benefits,\n' +
        'side_effects = EXCLUDED.side_effects,\n' +
        'warnings = EXCLUDED.warnings,\n' +
        'dosage_protocols = EXCLUDED.dosage_protocols;';

    const outputPath = path.resolve(__dirname, '../seed_data.sql');
    fs.writeFileSync(outputPath, sql);
    console.log(`Generated SQL file at: ${outputPath}`);
}

generateSql();
