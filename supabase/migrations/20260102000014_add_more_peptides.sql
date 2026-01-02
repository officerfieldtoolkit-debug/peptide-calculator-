-- Migration to add more popular peptides/compounds and fix duplicates

-- 1. Fix Epithalon/Epitalon duplicate
-- Update Epithalon with the protocol from Epitalon if it's missing, then delete Epitalon
UPDATE public.peptides
SET dosage_protocols = '[{"name":"Standard Anti-Aging Cycle","level":"Intermediate","description":"Khavinson Protocol","schedule":[{"week":"1-2","dose":"5-10mg","frequency":"Daily","notes":"10-20 day course"}],"duration":"Repeat every 6-12 months","notes":"Short, high-dose courses are standard for this peptide."}]'::jsonb
WHERE name = 'Epithalon' AND (dosage_protocols IS NULL OR dosage_protocols = '[]'::jsonb);

DELETE FROM public.peptides WHERE name = 'Epitalon';

-- 2. Insert new popular compounds (SARMs and Bioregulators often requested)
INSERT INTO public.peptides (
    name, category, half_life_hours, description, benefits, side_effects, warnings, dosage_protocols, common_dosage, research_links
) VALUES 
(
    'Ostarine (MK-2866)',
    'SARM / Muscle',
    24,
    'A Selective Androgen Receptor Modulator (SARM) developed for muscle wasting and osteoporosis.',
    ARRAY['Muscle preservation during caloric deficit','Injury repair (joints/tendons)','Lean muscle gains','Increased bone density','Minimal androgenic side effects at low doses'],
    ARRAY['Testosterone suppression (dose dependent)','Lipid profile alteration (HDL reduction)','Mild liver enzyme elevation'],
    ARRAY['Not FDA approved','PCT (Post Cycle Therapy) may be needed','Banned in sports (WADA)'],
    '[{"name":"Recomposition/Cut","level":"Intermediate","description":"Standard cutting cycle","schedule":[{"week":"1-8","dose":"15-25mg","frequency":"Daily","notes":"Take in the morning"}],"duration":"8 weeks","notes":"Follow with 4 weeks mini-PCT."}]'::jsonb,
    '10-25mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/20050857/']
),
(
    'Ligandrol (LGD-4033)',
    'SARM / Muscle',
    30,
    'A potent SARM known for significant mass and strength gains.',
    ARRAY['Significant muscle hypertrophy','Increased strength','Bone density improvement','Selective for muscle/bone tissue'],
    ARRAY['Testosterone suppression (moderate to high)','Lipid strain (lowered HDL)','Water retention'],
    ARRAY['Requires PCT','Monitor liver enzymes','Banned in sports'],
    '[{"name":"Bulking Cycle","level":"Advanced","description":"Mass building cycle","schedule":[{"week":"1-8","dose":"5-10mg","frequency":"Daily","notes":"Start low to assess tolerance"}],"duration":"8 weeks","notes":"Full PCT required after cycle."}]'::jsonb,
    '5-10mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/22459616/']
),
(
    'Testolone (RAD-140)',
    'SARM / Muscle',
    60,
    'A highly potent SARM designed to replace testosterone replacement therapy, offering drastic strength gains.',
    ARRAY['Drastic strength increases','Dry muscle gains (no water retention)','Neuroprotective effects (potential)','Fat loss support'],
    ARRAY['High testosterone suppression','Aggression/Irritability','Hair shedding','Lipid strain'],
    ARRAY['Requires comprehensive PCT','Potential liver toxicity','Long half-life requires caution'],
    '[{"name":"Strength Cycle","level":"Advanced","description":"Power and strength focus","schedule":[{"week":"1-8","dose":"10-20mg","frequency":"Daily","notes":"Dosing every other day may work due to long half-life"}],"duration":"8-10 weeks","notes":"Aggressive PCT required."}]'::jsonb,
    '10-20mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/21154196/']
),
(
    'Endoluten',
    'Bioregulator (Pineal)',
    NULL,
    'A peptide bioregulator extracted from the pineal gland, capable of increasing melatonin production and extending lifespan in animal models.',
    ARRAY['Restores melatonin production','Regulates circadian rhythms','Anti-aging / Life extension potential','Improves endocrine function','Better sleep quality'],
    ARRAY['None reported'],
    ARRAY['Expensive','Avoid if you have autoimmune conditions (general precaution for immunostimulants)'],
    '[{"name":"Standard Course","level":"Beginner","description":"Bioregulator protocol","schedule":[{"week":"1","dose":"1-2 caps / 10mg","frequency":"Daily","notes":"Morning administration"}],"duration":"10-30 days","notes":"Repeat every 6 months."}]'::jsonb,
    '10mg daily (Oral) or 1 capsule',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/15123323/']
),
(
    'Sigumir',
    'Bioregulator (Cartilage)',
    NULL,
    'A peptide bioregulator for cartilage and joints, used for arthritis and joint mobility.',
    ARRAY['Joint pain relief','Cartilage regeneration support','Improved mobility','Spinal health'],
    ARRAY['None reported'],
    ARRAY['Consistency is key'],
    '[]'::jsonb,
    '2 capsules / 20mg daily',
    ARRAY[]::text[]
),
(
    'Tadalafil',
    'Lifestyle /Blood Flow',
    17,
    'A PDE5 inhibitor (Cialis) used for ED, but also popular for pumps, blood pressure, and prostate health.',
    ARRAY['Improved erectile quality','Lower blood pressure','Better gym pumps (vasodilation)','Prostate health (BPH)','Estrogen control (mild)'],
    ARRAY['Headache','Flushing','Stuffy nose','Bioack pain','Reflux'],
    ARRAY['Do not take with nitrates (low BP risk)','Priapism risk (rare)'],
    '[{"name":"Daily Low Dose","level":"Beginner","description":"For BPH and general flow","schedule":[{"week":"Ongoing","dose":"2.5-5mg","frequency":"Daily","notes":"Take at same time daily"}],"duration":"Ongoing","notes":"Discontinue if side effects occur."}]'::jsonb,
    '2.5-5mg daily or 10-20mg varying',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/12898828/']
),
(
    'Sildenafil',
    'Lifestyle / Blood Flow',
    4,
    'A PDE5 inhibitor (Viagra) used for ED and pulmonary hypertension.',
    ARRAY['Strong erectile aid','Pulmonary hypertension treatment','Pre-workout blood flow (pumps)'],
    ARRAY['Headache','Flushing','Vision changes (blue tint)','Stuffy nose'],
    ARRAY['Do not take with nitrates','Vision loss (NAION) rare risk'],
    '[]'::jsonb,
    '20-100mg as needed',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/9533496/']
),
(
    'L-Carnitine',
    'Fat Loss / Metabolic',
    NULL,
    'Amino acid derivative that transports fatty acids into mitochondria to be burned for energy. Injectable form has much higher bioavailability.',
    ARRAY['Fat loss (needs insulin spike or fasted cardio)','Androgen receptor upregulation','Mental focus','Energy boost'],
    ARRAY['TMAO increase (Oral only - injectable bypasses gut)','Fishy body odor (rare, dose dependent)','Injection site pip (concentrated versions)'],
    ARRAY['Injectable requires IM usually','Oral bioavailability is very poor (<10%)'],
    '[{"name":"Fat Loss Injection","level":"Intermediate","description":"Injectable protocol","schedule":[{"week":"Ongoing","dose":"500-1000mg","frequency":"Daily","notes":"Pre-workout or with carbohydrates"}],"duration":"Ongoing","notes":"Injection into muscle (IM) preferred."}]'::jsonb,
    '500mg - 1000mg daily (Injectable)',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/2183103/']
)
ON CONFLICT (name) DO NOTHING;
