-- Additional peptides batch 3 - comprehensive encyclopedia expansion
-- Run this in Supabase SQL Editor

INSERT INTO public.peptides (name, category, half_life_hours, description, benefits, side_effects, warnings, dosage_protocols)
VALUES
-- More Weight Loss / Metabolic
(
    'Mazdutide',
    'Dual GLP-1/Glucagon Agonist',
    120,
    'Dual agonist in development in China showing significant weight loss and metabolic benefits.',
    ARRAY['Strong weight loss in trials','Dual metabolic pathway activation','Weekly dosing','Liver fat reduction'],
    ARRAY['Nausea','Vomiting','GI effects','Heart rate changes'],
    ARRAY['Investigational','Similar precautions to GLP-1 class'],
    '[]'
),
(
    'Pemvidutide',
    'Dual GLP-1/Glucagon Agonist',
    120,
    'Dual agonist being studied for NASH and obesity with liver-focused benefits.',
    ARRAY['Liver fat reduction','Weight loss','NASH improvement in trials','Metabolic benefits'],
    ARRAY['GI effects','Nausea','Blood pressure changes'],
    ARRAY['Investigational compound','Liver monitoring in trials'],
    '[]'
),
(
    'Cotadutide',
    'Dual GLP-1/Glucagon Agonist',
    24,
    'Daily dual agonist studied for diabetes, obesity, and NASH.',
    ARRAY['Blood sugar control','Weight loss','Liver health benefits','Dual mechanism'],
    ARRAY['Nausea','Vomiting','Diarrhea','Heart rate increase'],
    ARRAY['Investigational','Cardiovascular monitoring advised'],
    '[]'
),
(
    'Bimagrumab',
    'Myostatin/Activin Inhibitor',
    168,
    'Monoclonal antibody that blocks ActRII receptors, promoting muscle growth and fat loss.',
    ARRAY['Significant muscle mass gain','Fat loss','Improved body composition','Dual effects on muscle and fat'],
    ARRAY['Muscle spasms','Diarrhea','Skin reactions','Acne'],
    ARRAY['Investigational antibody','Infusion-related reactions possible','Medical supervision required'],
    '[]'
),

-- More Growth Hormone Related
(
    'Somatorelin (GHRH 1-29)',
    'Growth Hormone Releasing Hormone',
    0.5,
    'The bioactive fragment of GHRH that stimulates pituitary GH release.',
    ARRAY['Natural GH stimulation','Short-acting GHRH','Physiologic pulsatile release','Combined well with GHRP'],
    ARRAY['Flushing','Injection site reactions','Transient dizziness'],
    ARRAY['Short half-life requires timing','Often combined with GHRP','Medical supervision advised'],
    '[]'
),
(
    'Modified GRF (1-29)',
    'Growth Hormone Releasing Hormone',
    30,
    'Modified GHRH 1-29 with amino acid substitutions for improved stability.',
    ARRAY['Longer acting than native GHRH','Better stability','Synergistic with GHRP','Improved GH pulsatility'],
    ARRAY['Flushing','Water retention','Fatigue','Injection site irritation'],
    ARRAY['Same precautions as other GHRH','Monitor IGF-1','Use with GHRP for best results'],
    '[]'
),
(
    'Lenomorelin (Ghrelin Analog)',
    'Growth Hormone Secretagogue',
    1,
    'Synthetic ghrelin receptor agonist studied for appetite and GH effects.',
    ARRAY['Appetite stimulation','GH release','Potential for cachexia treatment','Ghrelin pathway activation'],
    ARRAY['Increased hunger','GI effects','Blood sugar changes'],
    ARRAY['May cause unwanted weight gain','Monitor glucose','Investigational'],
    '[]'
),
(
    'Anamorelin',
    'Growth Hormone Secretagogue',
    7,
    'Oral ghrelin receptor agonist approved in Japan for cancer cachexia.',
    ARRAY['Oral administration','Appetite stimulation','Lean body mass increase','GH and IGF-1 elevation'],
    ARRAY['Increased appetite','Glucose elevation','Edema','Fatigue'],
    ARRAY['Monitor blood sugar','Approved only in certain countries','Medical supervision required'],
    '[]'
),

-- More Healing & Tissue Repair
(
    'Collagen Peptides (Hydrolyzed)',
    'Structural Protein',
    4,
    'Bioactive peptides from collagen hydrolysis supporting skin, joints, and connective tissue.',
    ARRAY['Skin elasticity improvement','Joint health support','Gut lining support','Nail and hair strength','Oral bioavailability'],
    ARRAY['Mild GI upset rare','Generally very well-tolerated'],
    ARRAY['Source quality important (bovine, marine, etc.)','Allergies to source animals possible'],
    '[]'
),
(
    'P-15 Peptide',
    'Bone & Tissue Repair',
    2,
    'Synthetic 15-amino acid peptide mimicking collagen type I binding domain for bone healing.',
    ARRAY['Bone regeneration support','Used in dental applications','Cell adhesion promotion','Tissue engineering'],
    ARRAY['Localized reactions','Limited systemic data'],
    ARRAY['Primarily used in medical devices','Surgical application','Specialist use only'],
    '[]'
),
(
    'OP-1 (BMP-7)',
    'Bone Morphogenetic Protein',
    4,
    'Bone morphogenetic protein approved for certain bone healing applications.',
    ARRAY['Bone regeneration','Spinal fusion applications','Fracture healing','Cartilage repair potential'],
    ARRAY['Inflammation','Ectopic bone formation possible','Immune reactions'],
    ARRAY['Surgical use only','Specific approved indications','Specialist administration required'],
    '[]'
),

-- More Anti-Inflammatory & Immune
(
    'Alpha-1 Antitrypsin Peptide',
    'Anti-Inflammatory',
    6,
    'Fragments of A1AT protein with anti-inflammatory and tissue-protective effects.',
    ARRAY['Anti-inflammatory','Protease inhibition','Lung tissue protection','Immune modulation'],
    ARRAY['Injection site reactions','Allergic reactions possible'],
    ARRAY['Research applications','Blood product considerations','Specialist use'],
    '[]'
),
(
    'Glatiramer Acetate',
    'Immune Modulator',
    12,
    'FDA-approved peptide mixture for multiple sclerosis treatment.',
    ARRAY['MS relapse reduction','Immune modulation','Neuroprotective effects','Well-established safety'],
    ARRAY['Injection site reactions','Lipoatrophy','Immediate post-injection reactions','Cardiac effects rare'],
    ARRAY['Prescription medication','MS specialist supervision','Regular monitoring required'],
    '[]'
),
(
    'Annexin A1 Peptide',
    'Anti-Inflammatory',
    1,
    'Peptide fragments of Annexin A1 with resolution of inflammation properties.',
    ARRAY['Promotes inflammation resolution','Anti-inflammatory','Tissue protection','Natural resolution pathway'],
    ARRAY['Limited human data','Injection site reactions'],
    ARRAY['Research compound','Limited clinical experience'],
    '[]'
),

-- More Cognitive & Neuroprotective
(
    'Cortexin',
    'Neuropeptide Blend',
    2,
    'Bovine brain-derived peptide mixture used in Russia for neurological conditions.',
    ARRAY['Cognitive support','Neuroprotective','Used for stroke recovery','Brain trauma support'],
    ARRAY['Injection site pain','Allergic reactions possible','Headache'],
    ARRAY['Animal-derived product','Quality control essential','Medical supervision required'],
    '[]'
),
(
    'Semorilin',
    'Cognitive & Anti-Aging',
    6,
    'Peptide studied for cognitive enhancement and anti-aging brain effects.',
    ARRAY['Cognitive enhancement potential','Neuroprotective','Memory support'],
    ARRAY['Limited data','Possible headache','Sleep changes'],
    ARRAY['Research compound','Limited human studies'],
    '[]'
),
(
    'Noopept (GVS-111)',
    'Nootropic Peptide',
    1,
    'Dipeptide derivative with cognitive enhancement and neuroprotective properties.',
    ARRAY['Cognitive enhancement','Neuroprotective','Anxiolytic effects','Low dose requirement','Oral and sublingual availability'],
    ARRAY['Irritability','Sleep disturbances','Headache','Brain fog in some'],
    ARRAY['Not approved in many countries','Long-term effects unknown','May affect mood'],
    '[]'
),
(
    'Memantine Combination Peptides',
    'Cognitive',
    24,
    'Peptide formulations designed to work synergistically with NMDA modulation.',
    ARRAY['Enhanced cognitive effects','Neuroprotection','Synergistic benefits'],
    ARRAY['Variable by formulation','CNS effects possible'],
    ARRAY['Experimental combinations','Use only under supervision'],
    '[]'
),

-- More Sexual Health & Hormone
(
    'Melanotan 1.5',
    'Melanocortin Agonist',
    1,
    'Hybrid peptide combining features of MT-I and MT-II for tanning with fewer side effects.',
    ARRAY['Tanning effects','Potentially fewer side effects than MT-II','Balanced receptor profile'],
    ARRAY['Nausea','Flushing','May still affect libido'],
    ARRAY['Unregulated compound','Same melanoma monitoring as other melanotans'],
    '[]'
),
(
    'Oxytocin',
    'Neurohormone',
    3,
    'Natural hormone with bonding, stress reduction, and potential therapeutic effects.',
    ARRAY['Bonding and trust enhancement','Stress reduction','Social anxiety reduction','Lactation support','Uterine contraction'],
    ARRAY['Nasal irritation','Headache','Heart effects at high doses'],
    ARRAY['Prescription for medical uses','Intranasal research use','May affect social behavior'],
    '[]'
),
(
    'Carbetocin',
    'Oxytocin Analog',
    40,
    'Long-acting oxytocin analog used for postpartum hemorrhage prevention.',
    ARRAY['Longer half-life than oxytocin','Uterine contraction','Single-dose effectiveness','Medical use established'],
    ARRAY['Nausea','Abdominal pain','Headache','Flushing'],
    ARRAY['Medical use under supervision','Contraindicated in certain conditions','Not for recreational use'],
    '[]'
),

-- More Skin & Cosmetic
(
    'Palmitoyl Tripeptide-1',
    'Cosmetic Peptide',
    6,
    'Lipopeptide that stimulates collagen production and ECM repair in skin.',
    ARRAY['Collagen stimulation','Wrinkle reduction','Skin firming','Works synergistically with other peptides'],
    ARRAY['Skin irritation rare','Allergic reactions possible'],
    ARRAY['Topical cosmetic use','Patch test recommended'],
    '[]'
),
(
    'Palmitoyl Tripeptide-5',
    'Cosmetic Peptide',
    6,
    'TGF-beta mimetic peptide for collagen synthesis and anti-aging effects.',
    ARRAY['Increases collagen I, III, IV','Anti-wrinkle effects','Skin elasticity improvement'],
    ARRAY['Minimal reported effects','Rare skin sensitivity'],
    ARRAY['Cosmetic use only','Quality formulation important'],
    '[]'
),
(
    'Acetyl Tetrapeptide-5 (Eyeseryl)',
    'Cosmetic Peptide',
    6,
    'Peptide specifically designed to reduce under-eye puffiness and dark circles.',
    ARRAY['Reduces eye puffiness','Decreases dark circles','Improves periorbital skin','Anti-edema effects'],
    ARRAY['Rare eye irritation','Sensitivity possible'],
    ARRAY['Avoid direct eye contact','Cosmetic use around eyes'],
    '[]'
),
(
    'Dipeptide Diaminobutyroyl Benzylamide',
    'Cosmetic Peptide',
    6,
    'Synthetic peptide with muscle-relaxing properties for expression line reduction.',
    ARRAY['Expression line reduction','Botox-like effects topically','Safe cosmetic alternative'],
    ARRAY['Skin sensitivity rare','Contact dermatitis possible'],
    ARRAY['Topical use only','Not a medical treatment'],
    '[]'
),
(
    'Acetyl Dipeptide-1 Cetyl Ester',
    'Cosmetic Peptide',
    6,
    'Anti-irritant peptide that calms sensitive skin and reduces inflammation.',
    ARRAY['Soothes sensitive skin','Anti-inflammatory','Reduces skin stress','Barrier support'],
    ARRAY['Very well-tolerated','Rare sensitivity'],
    ARRAY['Suitable for sensitive skin','Cosmetic use'],
    '[]'
),

-- More Performance & Athletic
(
    'BPC-157 Stable (Arginate/Acetate)',
    'Healing Peptide',
    4,
    'Stabilized forms of BPC-157 with improved shelf life and consistency.',
    ARRAY['Same benefits as BPC-157','Improved stability','Better shelf life','Consistent potency'],
    ARRAY['Same as standard BPC-157','Generally well-tolerated'],
    ARRAY['Quality sourcing critical','Same precautions as BPC-157'],
    '[]'
),
(
    'Myostatin Inhibitor Peptide',
    'Muscle Growth',
    6,
    'Various peptides designed to inhibit myostatin for muscle growth promotion.',
    ARRAY['Muscle growth support','Myostatin pathway inhibition','May reduce muscle wasting'],
    ARRAY['Unknown long-term effects','Variable by specific peptide'],
    ARRAY['Research compounds','Variable quality and verification','Use caution'],
    '[]'
),
(
    'Adipotide (FTPP)',
    'Fat Loss',
    2,
    'Experimental peptide targeting blood vessels feeding fat tissue.',
    ARRAY['Targeted fat cell death','Rapid weight loss in studies','Novel mechanism'],
    ARRAY['Kidney toxicity reported','Dehydration','Serious side effect potential'],
    ARRAY['DANGEROUS - serious toxicity reported','Not for human use','Kidney damage documented'],
    '[]'
),

-- Diabetes & Metabolic
(
    'Pramlintide (Symlin)',
    'Amylin Analog',
    0.5,
    'FDA-approved amylin analog for diabetes management with mealtime dosing.',
    ARRAY['Blood sugar control','Reduces post-meal glucose spikes','Weight neutral or loss','Reduces glucagon'],
    ARRAY['Nausea','Hypoglycemia with insulin','Injection site reactions','Headache'],
    ARRAY['Must reduce insulin dose when starting','Hypoglycemia risk','Mealtime dosing required'],
    '[]'
),
(
    'GLP-1/GIP/Glucagon Triple Agonist',
    'Triple Agonist',
    120,
    'Next-generation metabolic peptides targeting three pathways simultaneously.',
    ARRAY['Enhanced weight loss','Multi-pathway metabolic effects','Superior efficacy potential'],
    ARRAY['GI effects','Heart rate changes','Combined side effect profile'],
    ARRAY['Several in development','Same class precautions','Investigational'],
    '[]'
),

-- Antimicrobial & Antiviral
(
    'Defensin HD5',
    'Antimicrobial Peptide',
    1,
    'Human alpha-defensin with antimicrobial activity against bacteria, fungi, and viruses.',
    ARRAY['Broad-spectrum antimicrobial','Innate immune support','Gut barrier protection'],
    ARRAY['Potential inflammatory effects','Limited human data'],
    ARRAY['Research compound','Potent immune effects','Medical supervision'],
    '[]'
),
(
    'Protegrin-1',
    'Antimicrobial Peptide',
    0.5,
    'Porcine antimicrobial peptide with potent activity against drug-resistant bacteria.',
    ARRAY['Kills drug-resistant bacteria','Rapid bactericidal effect','Biofilm disruption'],
    ARRAY['Potential toxicity at high doses','Hemolytic concerns'],
    ARRAY['Research compound','Toxicity concerns limit use','Derivatives being developed'],
    '[]'
),
(
    'Brilacidin',
    'Antimicrobial Peptide',
    4,
    'Defensin-mimetic drug candidate for bacterial infections and inflammatory conditions.',
    ARRAY['Antibacterial activity','Anti-inflammatory','Multiple clinical applications studied'],
    ARRAY['GI effects','Injection site reactions'],
    ARRAY['Investigational','Multiple trials ongoing'],
    '[]'
),

-- Cardiovascular
(
    'Ularitide',
    'Cardiovascular Peptide',
    0.5,
    'Synthetic urodilatin analog studied for acute heart failure.',
    ARRAY['Vasodilation','Natriuresis','Cardioprotective effects','Heart failure treatment potential'],
    ARRAY['Hypotension','Dizziness','Worsening renal function'],
    ARRAY['IV administration only','Hospital setting required','Investigational'],
    '[]'
),
(
    'Relaxin-2',
    'Cardiovascular Peptide',
    0.5,
    'Pregnancy hormone studied for cardiovascular and fibrosis applications.',
    ARRAY['Vasodilation','Anti-fibrotic effects','Renal blood flow improvement','Cardiovascular protection'],
    ARRAY['Hypotension','Headache','Injection site reactions'],
    ARRAY['Investigational','Short half-life challenging','Medical supervision essential'],
    '[]'
),

-- Miscellaneous Therapeutic
(
    'Glucagon',
    'Pancreatic Hormone',
    0.5,
    'Hormone used for severe hypoglycemia and as a diagnostic agent.',
    ARRAY['Emergency hypoglycemia treatment','GI smooth muscle relaxation','Diagnostic imaging use'],
    ARRAY['Nausea','Vomiting','Hyperglycemia','Allergic reactions rare'],
    ARRAY['Emergency use primarily','Short duration','Medical supervision for diagnostic use'],
    '[]'
),
(
    'Calcitonin',
    'Bone Metabolism',
    1,
    'Hormone used for osteoporosis, Paget disease, and hypercalcemia.',
    ARRAY['Inhibits bone resorption','Lowers blood calcium','Pain relief in bone disease','Nasal or injection forms'],
    ARRAY['Nasal irritation','Nausea','Facial flushing','Increased urination'],
    ARRAY['Long-term cancer concerns (nasal form)','Regular monitoring needed','Medical supervision required'],
    '[]'
),
(
    'Vasopressin (ADH)',
    'Pituitary Hormone',
    0.5,
    'Antidiuretic hormone used for diabetes insipidus and vasodilatory shock.',
    ARRAY['Water retention','Blood pressure support in shock','Diabetes insipidus treatment'],
    ARRAY['Hyponatremia','Vasoconstriction effects','GI effects'],
    ARRAY['ICU/hospital setting for shock','Electrolyte monitoring essential','Medical supervision required'],
    '[]'
),
(
    'Desmopressin',
    'Vasopressin Analog',
    3,
    'Long-acting synthetic vasopressin for diabetes insipidus and bleeding disorders.',
    ARRAY['Longer acting than vasopressin','Diabetes insipidus control','Hemophilia bleeding control','Bedwetting treatment'],
    ARRAY['Hyponatremia','Headache','Nausea','Fluid retention'],
    ARRAY['Monitor sodium levels','Water restriction with use','Medical supervision required'],
    '[]'
),
(
    'Teriparatide (Forteo)',
    'PTH Analog',
    1,
    'FDA-approved PTH 1-34 fragment for severe osteoporosis treatment.',
    ARRAY['Stimulates bone formation','Increases bone density','Reduces fracture risk','Anabolic bone effects'],
    ARRAY['Dizziness','Leg cramps','Nausea','Hypercalcemia'],
    ARRAY['Black box warning for osteosarcoma','Limited duration of use (2 years)','Medical supervision required'],
    '[]'
),
(
    'Abaloparatide (Tymlos)',
    'PTHrP Analog',
    1,
    'PTH-related protein analog for osteoporosis with potentially fewer side effects than PTH.',
    ARRAY['Bone formation stimulation','Fracture risk reduction','May have fewer hypercalcemia effects'],
    ARRAY['Dizziness','Nausea','Headache','Palpitations'],
    ARRAY['Same osteosarcoma warning as teriparatide','Limited use duration','Medical supervision required'],
    '[]'
),

-- Research & Experimental
(
    'FOXO4-DRI',
    'Senolytic Peptide',
    4,
    'Cell-penetrating peptide designed to selectively induce senescent cell death.',
    ARRAY['Senolytic effects','Targets senescent cells','Anti-aging research','Promotes apoptosis in aged cells'],
    ARRAY['Unknown human safety profile','Theoretical cancer concerns','Very limited data'],
    ARRAY['Highly experimental','No human trials','Research use only','Serious unknowns'],
    '[]'
),
(
    'SS-31 Peptide (Elamipretide)',
    'Mitochondrial Peptide',
    1,
    'Mitochondria-targeted peptide in clinical trials for heart and muscle diseases.',
    ARRAY['Mitochondrial function improvement','Cardioprotection','Muscle disease applications','Eye disease trials'],
    ARRAY['Injection site reactions','Headache','Nausea'],
    ARRAY['Investigational','Clinical trial stage','Medical supervision required'],
    '[]'
),
(
    'Mastoparan',
    'Cell Signaling Peptide',
    0.5,
    'Wasp venom peptide studied for its effects on cell signaling and potential antimicrobial activity.',
    ARRAY['G-protein activation','Antimicrobial effects','Research tool compound'],
    ARRAY['Cytotoxicity concerns','Potential allergic reactions','Hemolytic effects'],
    ARRAY['Research compound only','Toxic at higher doses','Not for therapeutic use'],
    '[]'
),
(
    'Bortezomib',
    'Proteasome Inhibitor',
    4,
    'Peptide boronic acid FDA-approved for multiple myeloma treatment.',
    ARRAY['Cancer cell death induction','Multiple myeloma treatment','Established efficacy'],
    ARRAY['Peripheral neuropathy','Fatigue','GI effects','Low blood counts'],
    ARRAY['Chemotherapy agent','Oncologist supervision only','Serious side effect potential'],
    '[]'
)
ON CONFLICT (name) DO UPDATE SET
category = EXCLUDED.category,
half_life_hours = EXCLUDED.half_life_hours,
description = EXCLUDED.description,
benefits = EXCLUDED.benefits,
side_effects = EXCLUDED.side_effects,
warnings = EXCLUDED.warnings,
dosage_protocols = EXCLUDED.dosage_protocols;
