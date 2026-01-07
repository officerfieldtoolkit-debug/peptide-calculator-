-- Additional peptides batch 2 - expanding the encyclopedia
-- Run this in Supabase SQL Editor or via supabase db push

INSERT INTO public.peptides (name, category, half_life_hours, description, benefits, side_effects, warnings, dosage_protocols)
VALUES
-- More GLP-1 and Weight Loss
(
    'Exenatide (Byetta)',
    'GLP-1 Agonist',
    2.4,
    'First-in-class GLP-1 receptor agonist derived from Gila monster venom, used for type 2 diabetes.',
    ARRAY['Blood sugar control','Modest weight loss','Twice daily or weekly formulations available','Cardiovascular benefits'],
    ARRAY['Nausea','Vomiting','Diarrhea','Injection site reactions','Pancreatitis risk'],
    ARRAY['Pancreatitis warning','Thyroid C-cell tumor risk','Not for type 1 diabetes','Kidney function monitoring required'],
    '[]'
),
(
    'Cagrilintide',
    'Amylin Analog',
    168,
    'Long-acting amylin analog being studied in combination with semaglutide for enhanced weight loss.',
    ARRAY['Enhanced satiety','Complements GLP-1 effects','Once-weekly dosing','Significant weight loss in trials'],
    ARRAY['Nausea','Injection site reactions','GI effects'],
    ARRAY['Investigational compound','Similar precautions to other incretin therapies'],
    '[]'
),
(
    'Survodutide',
    'Dual GLP-1/Glucagon Agonist',
    120,
    'Dual agonist targeting GLP-1 and glucagon receptors for weight and metabolic benefits.',
    ARRAY['Strong weight loss effects','Improves liver fat','Metabolic benefits from glucagon activation','Weekly dosing'],
    ARRAY['Nausea','Diarrhea','Heart rate increase'],
    ARRAY['Investigational','Monitor liver function','Cardiovascular monitoring advised'],
    '[]'
),
(
    'Orforglipron',
    'Oral GLP-1 Agonist',
    24,
    'Non-peptide oral GLP-1 receptor agonist in development offering pill-based alternative.',
    ARRAY['Oral administration','No injections needed','Daily pill convenience','Comparable efficacy to injectables in trials'],
    ARRAY['Nausea','Vomiting','Decreased appetite','GI effects'],
    ARRAY['Investigational compound','Take on empty stomach','Same class warnings as injectable GLP-1s'],
    '[]'
),

-- More Healing Peptides
(
    'KPV',
    'Anti-Inflammatory Peptide',
    0.5,
    'Tripeptide fragment of α-MSH with potent anti-inflammatory effects, especially for gut health.',
    ARRAY['Strong anti-inflammatory','Gut healing support','Reduces IBD symptoms (research)','Antimicrobial properties','Skin healing'],
    ARRAY['Generally well-tolerated','Injection site reactions','Limited human data'],
    ARRAY['Research compound','Quality sourcing important','May affect immune response'],
    '[]'
),
(
    'ARA-290',
    'Tissue Protective',
    1,
    'Non-erythropoietic EPO derivative studied for neuroprotection and tissue repair.',
    ARRAY['Tissue protective without blood effects','Neuroprotective','May help neuropathic pain','Anti-inflammatory'],
    ARRAY['Injection site reactions','Headache','Nausea'],
    ARRAY['Investigational compound','Monitor blood counts initially','Medical supervision required'],
    '[]'
),
(
    'TA1 (Thymosin Alpha-1)',
    'Immune Modulator',
    2,
    'Synthetic thymic peptide with immune-modulating properties, approved in some countries.',
    ARRAY['Immune system support','Hepatitis B adjunct therapy','May enhance vaccine response','T-cell function support'],
    ARRAY['Injection site reactions','Fatigue','Mild flu-like symptoms'],
    ARRAY['Use under medical supervision','Autoimmune considerations','Quality control important'],
    '[]'
),

-- Cognitive & Nootropic Peptides
(
    'NA-Semax Amidate',
    'Cognitive & Nootropic',
    0.5,
    'Modified version of Semax with enhanced potency and potentially longer duration.',
    ARRAY['Enhanced cognitive effects','Improved over standard Semax','Neuroprotective','Better bioavailability'],
    ARRAY['Nasal irritation','Headache','Possible mood changes'],
    ARRAY['Potent modification—start low','Limited safety data','Avoid in pregnancy'],
    '[]'
),
(
    'N-Acetyl Selank Amidate',
    'Cognitive & Anxiolytic',
    0.5,
    'Enhanced version of Selank with improved stability and potentially stronger effects.',
    ARRAY['Enhanced anxiolytic effects','Improved stability','Cognitive support','Immune modulation'],
    ARRAY['Nasal irritation','Fatigue','Headache'],
    ARRAY['Modified peptide—caution advised','Limited long-term data'],
    '[]'
),
(
    'FGL (L)',
    'Nootropic & Neuroprotection',
    2,
    'NCAM mimetic peptide fragment studied for cognitive enhancement and neuroprotection.',
    ARRAY['NCAM pathway modulation','Memory enhancement (animal data)','Neuroprotective potential','Synaptic plasticity support'],
    ARRAY['Limited human side effect data','Injection site reactions'],
    ARRAY['Research compound','Very limited human data','Use with caution'],
    '[]'
),
(
    'NSI-189',
    'Cognitive & Antidepressant',
    12,
    'Small molecule that promotes hippocampal neurogenesis, studied for depression and cognition.',
    ARRAY['Neurogenesis stimulation','Antidepressant potential','Cognitive enhancement','Hippocampal volume increase in trials'],
    ARRAY['Headache','Dizziness','Insomnia','Mood changes'],
    ARRAY['Investigational compound','Mental health monitoring advised','Not approved for any indication'],
    '[]'
),

-- More Anti-Aging
(
    'Thymalin (Thymic Peptide)',
    'Anti-Aging & Immune',
    2,
    'Bovine thymus preparation used in Russia for immune and anti-aging support.',
    ARRAY['Immune system rejuvenation','Thymus function support','Anti-aging potential','T-cell restoration'],
    ARRAY['Injection site reactions','Allergic potential (bovine source)'],
    ARRAY['Animal-derived product','Allergy testing may be needed','Quality control critical'],
    '[]'
),
(
    'Pinealon',
    'Cognitive & Anti-Aging',
    1,
    'Short peptide claimed to regulate pineal gland function and support cognitive aging.',
    ARRAY['Pineal gland support','Sleep regulation potential','Cognitive anti-aging','Neuroprotective'],
    ARRAY['Limited data','Generally mild reported effects'],
    ARRAY['Very limited research','Speculative benefits','Use caution'],
    '[]'
),
(
    'Vilon',
    'Immune & Anti-Aging',
    1,
    'Dipeptide studied for immune system and anti-aging effects in Russian research.',
    ARRAY['Immune modulation','Lymphocyte support','Anti-aging potential'],
    ARRAY['Limited side effect profile known','Injection site reactions'],
    ARRAY['Limited Western research','Russian peptide research','Quality sourcing important'],
    '[]'
),
(
    'Livagen',
    'Liver & Anti-Aging',
    1,
    'Tetrapeptide studied for liver support and regeneration.',
    ARRAY['Liver cell support','Potential hepatoprotective effects','Anti-aging for liver tissue'],
    ARRAY['Limited data','Generally well-tolerated in studies'],
    ARRAY['Very limited research','Use under supervision','Monitor liver function'],
    '[]'
),

-- Sexual Health & Hormone
(
    'Triptorelin',
    'GnRH Agonist',
    6,
    'Synthetic GnRH used for prostate cancer, endometriosis, and sometimes PCT protocols.',
    ARRAY['Pituitary reset for HPTA','Testosterone suppression (therapeutic)','Endometriosis treatment','Prostate cancer treatment'],
    ARRAY['Hot flashes','Hormonal fluctuations','Bone density loss with long-term use','Sexual dysfunction'],
    ARRAY['Powerful hormonal effects','Medical supervision essential','PCT use controversial','Tumor flare possible initially'],
    '[]'
),
(
    'hCG (Human Chorionic Gonadotropin)',
    'Fertility & Hormone',
    36,
    'Hormone used to maintain testicular function during TRT and for fertility support.',
    ARRAY['Maintains testicular size during TRT','Stimulates testosterone production','Fertility support in men','Supports LH function'],
    ARRAY['Gynecomastia','Water retention','Mood swings','Headache'],
    ARRAY['Prescription medication','Requires medical supervision','May increase estrogen','Blood work monitoring essential'],
    '[]'
),
(
    'Enclomiphene',
    'SERM',
    24,
    'Selective estrogen receptor modulator that stimulates endogenous testosterone production.',
    ARRAY['Increases LH and FSH','Raises endogenous testosterone','Maintains fertility unlike TRT','Oral administration'],
    ARRAY['Visual disturbances','Mood changes','Hot flashes','Headache'],
    ARRAY['Off-label in many regions','Monitor hormone levels','Vision changes require stopping','Medical supervision needed'],
    '[]'
),

-- More Muscle & Performance
(
    'HGH Fragment 176-191',
    'Fat Loss & Metabolism',
    0.5,
    'Modified fragment of HGH that targets fat loss without other GH effects.',
    ARRAY['Targeted fat burning','No blood sugar effects','No muscle growth (isolated effect)','Short acting'],
    ARRAY['Injection site reactions','Possible fatigue','Hypoglycemia rare'],
    ARRAY['Multiple daily injections needed','Research compound','Quality and purity concerns'],
    '[]'
),
(
    'ACE-031',
    'Myostatin Inhibitor',
    12,
    'ActRIIB-Fc fusion protein that binds myostatin and related growth factors.',
    ARRAY['Muscle growth promotion','Myostatin inhibition','Reduced muscle wasting','Strength gains'],
    ARRAY['Nosebleeds','Gum bleeding','Telangiectasias','Development halted due to side effects'],
    ARRAY['Development discontinued','Vascular safety concerns','Research compound only','Not recommended'],
    '[]'
),
(
    'GDF-8 Propeptide',
    'Muscle Growth',
    12,
    'Myostatin propeptide that inhibits myostatin activity, potentially promoting muscle growth.',
    ARRAY['Myostatin inhibition','Muscle growth support','May reduce muscle wasting'],
    ARRAY['Very limited data','Unknown side effect profile'],
    ARRAY['Experimental compound','Very limited research','Use extreme caution'],
    '[]'
),

-- Skin & Hair
(
    'PTD-DBM',
    'Hair Growth',
    2,
    'Peptide studied for promoting hair growth by activating Wnt/β-catenin pathway.',
    ARRAY['Hair follicle activation','May promote hair regrowth','Targets hair loss pathways','Topical application'],
    ARRAY['Scalp irritation possible','Limited side effect data'],
    ARRAY['Research compound','Efficacy not proven in humans','Use quality-controlled sources'],
    '[]'
),
(
    'Copper Peptide AHK-Cu',
    'Hair Growth',
    2,
    'Tripeptide-copper complex studied for hair growth and skin rejuvenation.',
    ARRAY['Hair follicle support','Wound healing','Collagen stimulation','Similar to GHK-Cu for hair'],
    ARRAY['Skin/scalp irritation','Allergic reactions rare'],
    ARRAY['Topical use primary','Avoid if copper sensitive','Quality formulation important'],
    '[]'
),
(
    'Snap-8',
    'Cosmetic Peptide',
    6,
    'Octapeptide extension of Argireline with potentially enhanced anti-wrinkle effects.',
    ARRAY['Reduces expression wrinkles','Enhanced Argireline effects','Deeper peptide penetration claims','Non-invasive'],
    ARRAY['Skin irritation rare','Allergic reactions possible'],
    ARRAY['Cosmetic use only','Results vary','Not a Botox replacement'],
    '[]'
),
(
    'Copper Peptide GHK-Cu (Injectable)',
    'Healing & Anti-Aging',
    1,
    'Injectable form of GHK-Cu for systemic anti-aging and healing benefits.',
    ARRAY['Systemic anti-aging effects','Wound healing from within','Collagen synthesis','Hair growth support','Antioxidant effects'],
    ARRAY['Injection site reactions','Headache rare','Transient fatigue'],
    ARRAY['Different from topical—systemic effects','Monitor copper levels with long-term use','Avoid if copper sensitive'],
    '[]'
),

-- Cardio & Vascular
(
    'VIP (Vasoactive Intestinal Peptide)',
    'Immune & Vascular',
    1,
    'Neuropeptide with vasodilatory, anti-inflammatory, and immune effects.',
    ARRAY['Vasodilation','Anti-inflammatory','Neuroprotective','Mast cell stabilization','CIRS/mold illness protocol use'],
    ARRAY['Hypotension','Flushing','Diarrhea','Nasal congestion (intranasal)'],
    ARRAY['Blood pressure monitoring','Use in CIRS under practitioner guidance','May cause hypotension'],
    '[]'
),
(
    'Ang 1-7',
    'Cardiovascular',
    0.5,
    'Angiotensin fragment with opposing effects to Ang II, promoting vasodilation.',
    ARRAY['Cardioprotective','Vasodilation','Anti-inflammatory','Counter-regulatory to harmful angiotensin','Blood pressure support'],
    ARRAY['Hypotension possible','Limited human data'],
    ARRAY['Research compound','Monitor blood pressure','Limited safety data'],
    '[]'
),

-- More Immune
(
    'BPC-157 + TB-500 Blend',
    'Healing Peptide',
    4,
    'Common combination of BPC-157 and TB-500 for synergistic healing effects.',
    ARRAY['Combined healing benefits','Tendon and ligament repair','Reduced inflammation','Systemic and local healing','Convenience of single injection'],
    ARRAY['Combined side effect profile','Generally well-tolerated','Injection site reactions'],
    ARRAY['Compounded product—quality varies','Same precautions as individual peptides','Not FDA approved'],
    '[]'
),
(
    'Lactoferrin',
    'Immune & Antimicrobial',
    4,
    'Iron-binding glycoprotein with antimicrobial, anti-inflammatory, and immune effects.',
    ARRAY['Antimicrobial activity','Immune modulation','Iron regulation','Gut health support','Oral bioavailability'],
    ARRAY['GI upset rare','Allergic reactions (dairy source)'],
    ARRAY['Dairy-derived—avoid if allergic','May affect iron absorption','Generally very safe'],
    '[]'
),
(
    'Beta-Defensin 2',
    'Antimicrobial Peptide',
    1,
    'Human antimicrobial peptide with activity against bacteria, fungi, and some viruses.',
    ARRAY['Broad antimicrobial activity','Innate immune support','Wound healing','Biofilm disruption potential'],
    ARRAY['Limited human administration data','Potential inflammatory effects at high doses'],
    ARRAY['Research compound','Potent immune effects','Medical supervision required'],
    '[]'
),

-- Gut Health
(
    'Larazotide',
    'Gut Health',
    2,
    'Tight junction regulator studied for celiac disease and intestinal permeability.',
    ARRAY['Reduces intestinal permeability','Celiac symptom relief in trials','Leaky gut support','Oral administration'],
    ARRAY['Headache','GI effects','Generally well-tolerated in trials'],
    ARRAY['Investigational compound','Not yet approved','Celiac management still requires gluten avoidance'],
    '[]'
),
(
    'Glutamine Peptide',
    'Gut Health',
    2,
    'Stable form of glutamine for gut lining support and immune function.',
    ARRAY['Gut barrier support','Nitrogen donor for cells','Athletic recovery','Immune function support'],
    ARRAY['Generally very safe','GI upset rare at high doses'],
    ARRAY['Avoid in liver disease','May affect certain medications','High doses may accumulate ammonia'],
    '[]'
),

-- Pain Management
(
    'Ziconotide (Prialt)',
    'Pain Management',
    4,
    'Cone snail venom-derived peptide FDA-approved for severe chronic pain via intrathecal administration.',
    ARRAY['Powerful pain relief','Works differently than opioids','Non-addictive mechanism','For severe chronic pain'],
    ARRAY['Dizziness','Nausea','Confusion','Memory impairment','Psychiatric effects'],
    ARRAY['Intrathecal administration only','Serious psychiatric side effects possible','Specialized medical supervision required','Black box warning'],
    '[]'
),

-- Experimental & Cutting Edge
(
    'SARM-2f',
    'Growth Factor Mimetic',
    4,
    'Experimental compound mimicking certain growth factor effects.',
    ARRAY['Growth factor pathway activation','Muscle support potential','Research compound'],
    ARRAY['Unknown—very limited data','Experimental side effect profile'],
    ARRAY['Highly experimental','No human safety data','Research use only'],
    '[]'
),
(
    'RGD Peptides',
    'Cell Adhesion',
    1,
    'Peptides containing RGD sequence that modulate cell adhesion and integrin signaling.',
    ARRAY['Cell adhesion modulation','Wound healing research','Anti-cancer research','Tissue engineering applications'],
    ARRAY['Highly variable by specific peptide','Limited clinical data'],
    ARRAY['Research compounds','Many different RGD peptides exist','Context-specific effects'],
    '[]'
),
(
    'Tat-Beclin 1',
    'Autophagy Inducer',
    2,
    'Cell-penetrating peptide that induces autophagy, studied for antiviral and cellular health effects.',
    ARRAY['Autophagy induction','Antiviral potential','Cellular cleanup','Longevity research'],
    ARRAY['Unknown human side effects','Potential cellular stress'],
    ARRAY['Highly experimental','Autophagy effects can be complex','Research use only'],
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
