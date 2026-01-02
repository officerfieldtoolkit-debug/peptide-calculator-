-- Final batch to reach ~100 peptides and fix duplicates

-- 1. Deduplicate HGH Fragment
-- We have both 'HGH Frag 176-191' and 'HGH Fragment 176-191'. 
-- Remove the shorthand version if it exists, assuming the full name version is preferred and exists.
DELETE FROM public.peptides WHERE name = 'HGH Frag 176-191';

-- Also ensure we don't have other exact name duplicates just in case
DELETE FROM public.peptides a USING public.peptides b
WHERE a.id < b.id AND a.name = b.name;

-- 2. Insert remaining research compounds
INSERT INTO public.peptides (
    name, category, half_life_hours, description, benefits, side_effects, warnings, dosage_protocols, common_dosage, research_links
) VALUES 
(
    'S-23',
    'SARM / Muscle',
    12,
    'A non-steroidal SARM with very high binding affinity, known as a potential male contraceptive in trials.',
    ARRAY['Extreme muscle hardening','Fat loss','Increases bone mineral density','Strongest SARM available'],
    ARRAY['Complete shutdown of testosterone','Night sweats','Aggression','Hair loss','Acne'],
    ARRAY['Must use a Test base','PCT is mandatory','Liver toxicity risk'],
    '[{"name":"Hardening Cycle","level":"Advanced","description":"Pre-contest style polish","schedule":[{"week":"1-8","dose":"10-30mg","frequency":"Daily","notes":"Split dose AM/PM due to half-life"}],"duration":"8 weeks","notes":"Expect shutdown."}]'::jsonb,
    '10-30mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/19432398/']
),
(
    'Andarine (S-4)',
    'SARM / Cut',
    4,
    'One of the earliest SARMs, known for the "S4 aesthetic" - hard, dry, and vascular muscles.',
    ARRAY['Muscle hardening','Vascularity','Fat oxidation','Prevents bone loss'],
    ARRAY['Yellow vision tint (sepia tone)','Night blindness','Suppression'],
    ARRAY['Vision side effects are dose-dependent and reversible','Split dosing required'],
    '[{"name":"Cutting Protocol","level":"Intermediate","description":"Cosmetic finish","schedule":[{"week":"1-8","dose":"25-50mg","frequency":"Daily","notes":"Split dose 2-3x per day"}],"duration":"6-8 weeks","notes":"5 days on, 2 days off can mitigate vision sides."}]'::jsonb,
    '25-50mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/17530966/']
),
(
    'GW-0742',
    'Performance / PPAR',
    24,
    'A "Super Cardarine" PPAR-delta agonist, purportedly stronger but with less safety data.',
    ARRAY['Enhances endurance significantly','Rapid fat loss','Insulin sensitivity','Cardiovascular endurance'],
    ARRAY['Heart size increase (cardiomegaly) noted in some mouse studies at massive doses'],
    ARRAY['Less researched than Cardarine','Use with caution'],
    '[]'::jsonb,
    '10-20mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/22814748/']
),
(
    'SR-9011',
    'Performance / Rev-ErbA',
    4,
    'A Rev-ErbA agonist similar to SR-9009 but potentially better bioavailability.',
    ARRAY['Circadian rhythm regulation','Metabolic boost','Endurance','Reduced anxiety'],
    ARRAY['Wakefulness','Insomnia'],
    ARRAY['Dosing timing critical'],
    '[]'::jsonb,
    '10-30mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/22460951/']
),
(
    'ACP-105',
    'SARM / Mild',
    6,
    'A milder SARM known for strength and endurance with less suppression than others.',
    ARRAY['Lean gains','Strength','Endurance','Cognitive benefits (potential)','Less suppression'],
    ARRAY['Headache','Mild suppression'],
    ARRAY['Good for females (at low dose)'],
    '[]'::jsonb,
    '10-20mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/20839735/']
),
(
    'AICAR',
    'Metabolic / AMPK',
    NULL,
    'An AMPK activator that mimics the effects of exercise on cellular metabolism.',
    ARRAY['Increases endurance without exercise','Fat burning','Insulin sensitivity'],
    ARRAY['Lactic acid buildup','Heart valve issues (theoretical)'],
    ARRAY['Very expensive to run effective doses'],
    '[]'::jsonb,
    '10-50mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/18674809/']
),
(
    'Pramlintide',
    'Amylin Analog',
    3,
    'Synthetic amylin used with insulin to control glucose and suppress appetite.',
    ARRAY['Satiety','Glucose control','Weight loss'],
    ARRAY['Nausea (severe initially)','Hypoglycemia'],
    ARRAY['Do not mix in same syringe as insulin'],
    '[]'::jsonb,
    '15-60mcg before meals',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/15531668/']
),
(
    'Exenatide',
    'GLP-1 Agonist',
    2,
    'Detailed GLP-1 agonist, shorter acting than Semaglutide, derived from Gila Monster venom.',
    ARRAY['Blood sugar control','Weight loss','Neuroprotection'],
    ARRAY['Nausea','Pancreatitis risk'],
    ARRAY['Twice daily injection needed for standard version'],
    '[]'::jsonb,
    '5-10mcg twice daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/12479764/']
),
(
    'Triptorelin',
    'Hormone (GnRH)',
    NULL,
    'A potent GnRH agonist used to stimulate or suppress testosterone depending on dosing interval. Used for PCT to restart HPTA.',
    ARRAY['Restarts testosterone production (single dose)','Treats prostate cancer (depot)'],
    ARRAY['Chemical castration (if overdosed/continuous)','Hot flashes'],
    ARRAY['One single 100mcg shot is usually enough for PCT; more suppresses.'],
    '[]'::jsonb,
    '100mcg single dose (PCT)',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/3089404/']
),
(
    'Cortagen',
    'Bioregulator (Brain)',
    NULL,
    'A peptide bioregulator for the brain and immune system.',
    ARRAY['Brain repair','Anti-stress','Immune modulation'],
    ARRAY['None reported'],
    ARRAY[]::text[],
    '[]'::jsonb,
    '10mg daily course',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/12577695/']
),
(
    'Bronchogen',
    'Bioregulator (Lung)',
    NULL,
    'A peptide bioregulator for the respiratory system.',
    ARRAY['Lung function','Bronchitis recovery','Reduced cough'],
    ARRAY['None reported'],
    ARRAY[]::text[],
    '[]'::jsonb,
    '1 capsule / 10mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/18314644/']
),
(
    'Chonluten',
    'Bioregulator (Lung)',
    NULL,
    'Peptide bioregulator for the respiratory mucosa and lungs.',
    ARRAY['Lung health','Stamina','Mukolytic effect'],
    ARRAY['None reported'],
    ARRAY[]::text[],
    '[]'::jsonb,
    '10mg daily',
    ARRAY[]::text[]
),
(
    'Testagen',
    'Bioregulator (Testes)',
    NULL,
    'Peptide bioregulator for male reproductive health.',
    ARRAY['Testosterone support','Sperm quality','Libido'],
    ARRAY['None reported'],
    ARRAY[]::text[],
    '[]'::jsonb,
    '1-2 capsules daily',
    ARRAY[]::text[]
),
(
    'Glandokort',
    'Bioregulator (Adrenal)',
    NULL,
    'Peptide bioregulator for the adrenal glands.',
    ARRAY['Adrenal fatigue support','Stress resilience','Cortisol balance'],
    ARRAY['None reported'],
    ARRAY[]::text[],
    '[]'::jsonb,
    '10mg daily',
    ARRAY[]::text[]
),
(
    'Vasopressin',
    'Nootropic / Hormone',
    0.5,
    'Anti-diuretic hormone, used for memory retention and focus.',
    ARRAY['Memory recall','Focus','Water retention'],
    ARRAY['Water intoxication','Hypertension','Headache'],
    ARRAY['Monitor electrolyte balance'],
    '[]'::jsonb,
    '2-10IU daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/7123166/']
),
(
    'Desmopressin',
    'Nootropic',
    2,
    'Synthetic vasopressin analog with less pressor effect, used for memory.',
    ARRAY['Memory recall','Focus','Reduced urination'],
    ARRAY['Hyponatremia (Low sodium)','Headache'],
    ARRAY['Do not drink excessive water'],
    '[]'::jsonb,
    '0.1-0.2mg intranasal',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/3832/']
),
(
    'Matrixyl 3000',
    'Cosmetic',
    NULL,
    'A synergy of two matrikines used in anti-aging skincare.',
    ARRAY['Collagen synthesis','Wrinkle reduction','Skin firming'],
    ARRAY['Mild irritation'],
    ARRAY[]::text[],
    '[]'::jsonb,
    '3-8% topical',
    ARRAY[]::text[]
),
(
    'Thymogen',
    'Immune',
    NULL,
    'Synthetic dipeptide (Glutamyl-Tryptophan) for immune modulation.',
    ARRAY['Immune boost','Faster recovery from infection','Autoimmune regulation'],
    ARRAY['None reported'],
    ARRAY[]::text[],
    '[]'::jsonb,
    '100mcg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/17552093/']
),
(
    'Dalargin',
    'Healing / Gut',
    NULL,
    'A synthetic opioid-like peptide used for healing ulcers.',
    ARRAY['Ulcer healing','Stress protection','Tissue regeneration'],
    ARRAY['Mild sedation'],
    ARRAY[]::text[],
    '[]'::jsonb,
    '1mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/25644553/']
),
(
    'ACE-031',
    'Muscle / Myostatin',
    NULL,
    'Soluble Activin Receptor Type IIB that acts as a myostatin decoy.',
    ARRAY['Extreme muscle growth','Myostatin inhibition'],
    ARRAY['Nose bleeds','Gum bleeding','Telangiectasia (blood vessel dilation)'],
    ARRAY['Trial halted due to bleeding issues'],
    '[]'::jsonb,
    '1mg/kg (Experimental)',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/23168565/']
),
(
    'Follistatin 315',
    'Muscle',
    NULL,
    'An isoform of follistatin that binds myostatin.',
    ARRAY['Muscle growth','Less immunogenic than 344 (debated)'],
    ARRAY['Joint pain'],
    ARRAY[]::text[],
    '[]'::jsonb,
    '100mcg daily',
    ARRAY[]::text[]
),
(
    'Noopept',
    'Nootropic',
    NULL,
    'A dipeptide nootropic related to the racetam family, much more potent.',
    ARRAY['Memory','Focus','Neuroprotection','Anxiety reduction'],
    ARRAY['Headache','Brain fog (if overdose)','Irritability'],
    ARRAY['Peptide-derived but often classed as chemical nootropic'],
    '[]'::jsonb,
    '10-30mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/12596521/']
),
(
    'LGD-3303',
    'SARM',
    6,
    'A newer SARM, reportedly drier and harder than LGD-4033.',
    ARRAY['Dry muscle gains','Strength','Fullness'],
    ARRAY['Suppression','Dry joints'],
    ARRAY[]::text[],
    '[]'::jsonb,
    '10-20mg daily',
    ARRAY[]::text[]
),
(
    'AC-262',
    'SARM / Mild',
    NULL,
    'A mild SARM that selective targets muscle and bone with less prostate interaction.',
    ARRAY['Muscle retention','Mild gains','Safety profile'],
    ARRAY['Mild suppression'],
    ARRAY[]::text[],
    '[]'::jsonb,
    '10-30mg daily',
    ARRAY['https://pubmed.ncbi.nlm.nih.gov/18164613/']
),
(
    'Trestolone (MENT)',
    'Steroid / Peptide-like effects',
    NULL,
    'Not a peptide, but a potent synthetic steroid often grouped in research chemicals. Ment.',
    ARRAY['Extreme muscle growth','Male contraceptive potential'],
    ARRAY['Shut down','Estrogen issues'],
    ARRAY['Very potent'],
    '[]'::jsonb,
    '5-10mg daily (Injectable)',
    ARRAY[]::text[]
),
(
    'Oxytocin Acetate',
    'Hormone',
    NULL,
    'Hormone form often used for research.',
    ARRAY['Similar to oxytocin'],
    ARRAY['Uterine contraction'],
    ARRAY[]::text[],
    '[]'::jsonb,
    'Variable',
    ARRAY[]::text[]
),
(
    'Hexapeptide-11',
    'Cosmetic',
    NULL,
    'Peptide derived from yeast leading to firmness.',
    ARRAY['Collagen boost','Skin firming'],
    ARRAY['None reported'],
    ARRAY[]::text[],
    '[]'::jsonb,
    'Topical',
    ARRAY[]::text[]
)
ON CONFLICT (name) DO NOTHING;
