INSERT INTO public.peptides (name, category, half_life_hours, description, benefits, side_effects, warnings, dosage_protocols)
VALUES
(
    'Semaglutide',
    'GLP-1 Agonist',
    168,
    'A GLP-1 receptor agonist primarily used for weight loss and blood sugar management.',
    ARRAY['Significant weight loss (10-15% body weight)','Improved blood sugar control','Reduced appetite and food cravings','Cardiovascular benefits','Improved insulin sensitivity','Potential neuroprotective effects'],
    ARRAY['Nausea (especially when starting)','Vomiting','Diarrhea or constipation','Abdominal pain','Fatigue','Headache','Dizziness'],
    ARRAY['Risk of thyroid C-cell tumors (animal studies)','Pancreatitis risk','Gallbladder problems','Kidney problems in rare cases','Not for type 1 diabetes','Contraindicated with personal/family history of medullary thyroid carcinoma'],
    '[{"name":"Standard Weight Loss Protocol","level":"Beginner to Advanced","description":"FDA-approved escalation schedule for weight management","schedule":[{"week":"1-4","dose":"0.25mg","frequency":"Once weekly","notes":"Titration phase - minimize side effects"},{"week":"5-8","dose":"0.5mg","frequency":"Once weekly","notes":"Continue if tolerating well"},{"week":"9-12","dose":"1mg","frequency":"Once weekly","notes":"Therapeutic dose for many users"},{"week":"13-16","dose":"1.7mg","frequency":"Once weekly","notes":"Optional escalation"},{"week":"17+","dose":"2.4mg","frequency":"Once weekly","notes":"Maximum dose"}],"duration":"16-20 weeks minimum","notes":"Stay at each dose for at least 4 weeks. Only increase if weight loss plateaus and side effects are minimal."},{"name":"Maintenance Protocol","level":"Maintenance","description":"After reaching goal weight","schedule":[{"week":"Ongoing","dose":"0.5-1mg","frequency":"Once weekly","notes":"Lowest effective dose"}],"duration":"Long-term","notes":"Find minimum dose that maintains weight loss. Some users cycle off for 4-8 weeks periodically."}]'
  ),
(
    'Tirzepatide',
    'Dual GIP/GLP-1 Agonist',
    120,
    'A dual GIP and GLP-1 receptor agonist showing superior weight loss compared to semaglutide.',
    ARRAY['Superior weight loss (15-22% body weight)','Excellent blood sugar control','Improved lipid profiles','Reduced cardiovascular risk','Better appetite suppression than GLP-1 alone','Improved insulin sensitivity'],
    ARRAY['Nausea and vomiting','Diarrhea','Decreased appetite','Constipation','Indigestion','Fatigue'],
    ARRAY['Similar thyroid tumor risk as semaglutide','Pancreatitis risk','Hypoglycemia when combined with insulin','Gallbladder disease','Acute kidney injury in dehydrated patients'],
    '[{"name":"Escalation Protocol","level":"Beginner","description":"Standard FDA titration","schedule":[{"week":"1-4","dose":"2.5mg","frequency":"Once weekly","notes":"Starter dose"},{"week":"5-8","dose":"5mg","frequency":"Once weekly"},{"week":"9-12","dose":"7.5-10mg","frequency":"Once weekly","notes":"Advance if tolerated"},{"week":"13+","dose":"12.5-15mg","frequency":"Once weekly","notes":"Max dose"}],"duration":"Ongoing","notes":"Hold dose increases if GI effects persist."}]'
  ),
(
    'Liraglutide',
    'GLP-1 Agonist',
    13,
    'Daily GLP-1 analog used for diabetes and chronic weight management.',
    ARRAY['Weight loss and appetite control','Improved glycemic control','Cardiovascular risk reduction','Daily dosing allows quick titration changes'],
    ARRAY['Nausea','Vomiting','Diarrhea or constipation','Injection site pain'],
    ARRAY['Thyroid C-cell tumor warning','Pancreatitis risk','Gallbladder disease'],
    '[{"name":"Weight Management Titration","level":"Beginner","description":"Standard Saxenda titration","schedule":[{"week":"1","dose":"0.6mg","frequency":"Daily"},{"week":"2","dose":"1.2mg","frequency":"Daily"},{"week":"3","dose":"1.8mg","frequency":"Daily"},{"week":"4","dose":"2.4mg","frequency":"Daily"},{"week":"5+","dose":"3.0mg","frequency":"Daily","notes":"Maintenance/max"}],"duration":"Ongoing","notes":"Hold or reduce dose if GI side effects persist."}]'
  ),
(
    'Dulaglutide',
    'GLP-1 Agonist',
    120,
    'Once-weekly GLP-1 analog used for glycemic control with modest weight loss.',
    ARRAY['Improved glycemic control','Cardiovascular risk reduction data','Convenient weekly dosing'],
    ARRAY['Nausea','Diarrhea','Vomiting','Abdominal pain'],
    ARRAY['Thyroid C-cell tumor warning','Pancreatitis risk','Gallbladder disease'],
    '[]'
  ),
(
    'Retatrutide',
    'Triple Agonist (GLP-1/GIP/Glucagon)',
    0,
    'Triple incretin/agonist in trials showing substantial weight loss.',
    ARRAY['Very high weight loss in trials','Multi-pathway metabolic effects','Weekly dosing'],
    ARRAY['GI effects similar to GLP-1s','Potential heart rate increase','Injection site reactions'],
    ARRAY['Pancreatitis risk theoretical','May affect heart rate','Thyroid C-cell tumor warning anticipated'],
    '[]'
  ),
(
    'BPC-157',
    'Healing Peptide',
    4,
    'A synthetic peptide derived from a protective protein found in stomach acid, known for healing properties.',
    ARRAY['Accelerated wound healing','Tendon and ligament repair','Muscle healing','Gut healing (leaky gut, IBS)','Reduced inflammation','Joint pain relief','Neuroprotective effects','Improved blood flow'],
    ARRAY['Generally well-tolerated','Occasional fatigue','Dizziness (rare)','Nausea (rare)','Headache (rare)'],
    ARRAY['Limited human clinical trials','Long-term safety unknown','May affect blood pressure','Consult doctor if on blood thinners'],
    '[]'
  ),
(
    'TB-500 (Thymosin Beta-4)',
    'Healing Peptide',
    120,
    'A synthetic version of Thymosin Beta-4, promoting healing and recovery.',
    ARRAY['Enhanced tissue repair','Reduced inflammation','Improved flexibility','Faster injury recovery','Hair growth promotion','Cardiovascular protection','Neuroprotection'],
    ARRAY['Minimal side effects reported','Possible headache','Lethargy','Temporary flushing'],
    ARRAY['Banned by WADA for athletes','Limited long-term human studies','May promote cancer cell migration (theoretical)','Avoid if pregnant or breastfeeding'],
    '[]'
  ),
(
    'Ipamorelin',
    'Growth Hormone Secretagogue',
    2,
    'A selective growth hormone secretagogue that stimulates GH release without affecting cortisol.',
    ARRAY['Increased growth hormone production','Improved muscle mass','Enhanced fat loss','Better sleep quality','Improved skin elasticity','Faster recovery','Increased bone density','Anti-aging effects'],
    ARRAY['Water retention (mild)','Increased hunger','Tingling or numbness','Headache','Flushing'],
    ARRAY['May affect blood sugar levels','Not for use with active cancer','Consult doctor if diabetic','May interact with thyroid medications'],
    '[]'
  ),
(
    'CJC-1295 (no DAC)',
    'Growth Hormone Releasing Hormone',
    0.5,
    'A GHRH analog that increases growth hormone and IGF-1 levels with short half-life.',
    ARRAY['Increased GH and IGF-1 levels','Muscle growth','Fat loss','Improved recovery','Better sleep','Enhanced immune function','Increased bone density'],
    ARRAY['Water retention','Joint pain','Carpal tunnel symptoms','Increased hunger','Numbness or tingling'],
    ARRAY['May worsen existing tumors','Affects blood sugar','Not for pregnant/nursing women','Regular blood work recommended'],
    '[]'
  ),
(
    'CJC-1295 (DAC)',
    'Growth Hormone Releasing Hormone',
    168,
    'Long-acting GHRH analog with drug affinity complex (DAC) for extended half-life.',
    ARRAY['Sustained GH and IGF-1 elevation','Reduced injection frequency','Supports muscle gain and fat loss','Improved sleep quality','Potential immune support'],
    ARRAY['Water retention','Flu-like symptoms (rare)','Joint stiffness','Injection site irritation'],
    ARRAY['May worsen existing tumors','Monitor blood glucose and IGF-1','Not recommended during pregnancy','Use medical supervision for long protocols'],
    '[]'
  ),
(
    'MK-677 (Ibutamoren)',
    'Growth Hormone Secretagogue',
    24,
    'An oral ghrelin mimetic that increases GH and IGF-1 without injections.',
    ARRAY['Oral dosing convenience','Increased GH/IGF-1 levels','Improved sleep depth','Appetite stimulation','Potential muscle gain and fat loss support'],
    ARRAY['Water retention','Increased appetite','Numbness/tingling','Transient insulin resistance','Lethargy in some users'],
    ARRAY['Monitor glucose and lipids','Avoid in active cancer','Not for pregnancy or nursing','Use caution with diabetes or insulin resistance'],
    '[]'
  ),
(
    'Melanotan II',
    'Melanocortin Agonist',
    1,
    'A synthetic analog of alpha-melanocyte stimulating hormone, used for tanning and libido enhancement.',
    ARRAY['Skin tanning without UV exposure','Increased libido','Potential appetite suppression','Erectile function improvement','Reduced sun damage risk'],
    ARRAY['Nausea (common initially)','Flushing','Increased libido (can be unwanted)','Darkening of moles and freckles','Yawning and stretching','Spontaneous erections'],
    ARRAY['Not FDA approved','May increase melanoma risk (theoretical)','Can darken existing moles','Permanent skin darkening possible','Cardiovascular effects possible'],
    '[]'
  ),
(
    'PT-141 (Bremelanotide)',
    'Melanocortin Agonist',
    2.5,
    'A melanocortin receptor agonist for sexual dysfunction in men and women.',
    ARRAY['Improves libido in both sexes','Works independent of nitric oxide pathways','Rapid onset (within 30-60 minutes)','FDA-approved nasal form for female HSDD'],
    ARRAY['Nausea','Flushing','Headache','Transient blood pressure changes','Injection site irritation'],
    ARRAY['Avoid with uncontrolled hypertension','Not for pregnancy','Use caution with cardiovascular disease','Nasal formulation has specific dosing limits'],
    '[]'
  ),
(
    'GHK-Cu (Copper Peptide)',
    'Healing & Anti-Aging',
    1,
    'A naturally occurring copper complex with powerful healing and anti-aging properties.',
    ARRAY['Wound healing acceleration','Collagen and elastin production','Skin rejuvenation','Hair growth stimulation','Anti-inflammatory effects','Antioxidant properties','Improved skin firmness','Reduced fine lines and wrinkles'],
    ARRAY['Minimal side effects','Possible skin irritation (topical)','Mild headache (rare)','Temporary redness at injection site'],
    ARRAY['Avoid if allergic to copper','May interact with copper supplements','Limited long-term studies','Consult doctor if on blood thinners'],
    '[]'
  ),
(
    'AOD-9604',
    'Metabolic & Fat Loss',
    2,
    'A modified fragment of human growth hormone designed to promote fat loss without GH-related effects.',
    ARRAY['May enhance fat oxidation','Minimal impact on blood sugar','No significant effect on IGF-1','Generally mild side effect profile'],
    ARRAY['Headache (rare)','Mild nausea','Injection site redness'],
    ARRAY['Limited clinical validation','Avoid during pregnancy or nursing','Monitor for unexpected glucose changes'],
    '[]'
  ),
(
    'MOTS-c',
    'Metabolic & Mitochondrial',
    2,
    'A mitochondrial-derived peptide studied for metabolic regulation and exercise performance.',
    ARRAY['Improves insulin sensitivity (animal data)','Supports mitochondrial function','May enhance exercise performance','Potential anti-inflammatory effects'],
    ARRAY['Limited human data; side effects largely unknown','Mild fatigue reported anecdotally','Injection site irritation'],
    ARRAY['Use caution with metabolic disorders until more data emerges','Avoid during pregnancy','Monitor glucose if combining with other metabolic agents'],
    '[]'
  ),
(
    'Selank',
    'Cognitive & Anxiolytic',
    0.5,
    'An anxiolytic peptide derived from tuftsin, studied for calming and cognitive effects.',
    ARRAY['Reduces anxiety without sedation (anecdotal)','May improve focus and memory','Supports immune modulation','Low risk of dependence'],
    ARRAY['Mild nasal irritation (if intranasal)','Headache','Fatigue in some users'],
    ARRAY['Limited long-term human data','Avoid use in pregnancy','Monitor for mood changes when combined with other nootropics'],
    '[]'
  ),
(
    'Semax',
    'Cognitive & Nootropic',
    0.5,
    'A synthetic ACTH(4-10) analog used in Russia for cognitive support and neuroprotection.',
    ARRAY['May enhance focus and memory','Neuroprotective properties (animal data)','Potential mood stabilization','Low systemic side effect burden'],
    ARRAY['Nasal irritation','Headache','Transient blood pressure increase (rare)'],
    ARRAY['Avoid during pregnancy','Use caution with uncontrolled hypertension','Limited long-term safety data'],
    '[]'
  ),
(
    'Thymosin Alpha-1',
    'Immune Modulator',
    2,
    'Synthetic thymic peptide explored for immune modulation and antiviral support.',
    ARRAY['Supports immune response','Adjunct in some infections (regional use)','May aid vaccine response'],
    ARRAY['Injection site redness','Fatigue','Mild headache'],
    ARRAY['Use under medical supervision','Potential autoimmune considerations'],
    '[]'
  ),
(
    'Epithalon',
    'Longevity & Telomerase',
    20,
    'Tetrapeptide researched for potential telomerase activation and longevity effects.',
    ARRAY['Potential telomerase activation (animal data)','Sleep quality improvements (anecdotal)','Antioxidant activity'],
    ARRAY['Limited human data; generally mild','Injection site irritation','Occasional vivid dreams'],
    ARRAY['Long-term safety unknown','Use caution with hormone-sensitive conditions'],
    '[]'
  ),
(
    'SS-31 (Elamipretide)',
    'Mitochondrial Peptide',
    1,
    'A mitochondria-targeted peptide being studied for cardiomyopathy and mitochondrial disorders.',
    ARRAY['May improve mitochondrial function','Potential cardiac protective effects','Explored in ophthalmic formulations'],
    ARRAY['Injection site reactions','Headache','Nausea'],
    ARRAY['Use only under research/clinical supervision'],
    '[]'
  ),
(
    'Cerebrolysin',
    'Neuropeptide Blend',
    0,
    'A porcine brain-derived peptide mixture used in some regions for cognitive and stroke recovery support.',
    ARRAY['Neuroprotective properties','Potential cognitive support','May aid stroke recovery'],
    ARRAY['Injection site pain','Dizziness','Headache'],
    ARRAY['Avoid in seizure disorders without clearance','Use medical supervision for IV/IM'],
    '[]'
  ),
(
    'P21',
    'Nootropic Peptide',
    0,
    'A synthetic peptide derived from CNTF fragments, explored for neurotrophic effects.',
    ARRAY['Potential neurotrophic support (preclinical)','May aid cognitive function (anecdotal)'],
    ARRAY['Limited data; unknown long-term safety','Injection site irritation'],
    ARRAY['Research-only; insufficient human safety data'],
    '[]'
  ),
(
    'Follistatin 344',
    'Performance & Muscle',
    6,
    'A myostatin-binding protein fragment explored for muscle growth and recovery.',
    ARRAY['Potential increase in muscle mass','Supports recovery','May enhance strength gains','Synergistic with resistance training'],
    ARRAY['Injection site irritation','Possible GI discomfort','Unknown endocrine effects'],
    ARRAY['Not approved for human use','Potential impact on fertility and hormones unknown','Avoid if pregnant or breastfeeding'],
    '[]'
  ),
(
    'YK-11',
    'Performance & Muscle',
    6,
    'A myostatin-inhibiting SARM-like compound promoted for muscle growth.',
    ARRAY['Potential rapid strength gains','May inhibit myostatin pathways','Oral dosing convenience'],
    ARRAY['Joint pain','Liver strain potential','Hair shedding (androgenic)','Aggression or mood changes'],
    ARRAY['Hepatotoxicity risk—monitor liver enzymes','Not for women who are pregnant or breastfeeding','Prohormone/PCT considerations not well-studied'],
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