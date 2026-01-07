-- Update top peptides with detailed dosage protocols
-- Run this in Supabase SQL Editor

-- Semaglutide protocols (already has some, but let's enhance)
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Standard Weight Loss Protocol",
    "level": "Beginner to Advanced",
    "description": "FDA-approved escalation schedule for weight management",
    "schedule": [
      {"week": "1-4", "dose": "0.25mg", "frequency": "Once weekly", "notes": "Titration phase - minimize GI side effects"},
      {"week": "5-8", "dose": "0.5mg", "frequency": "Once weekly", "notes": "Continue if tolerating well"},
      {"week": "9-12", "dose": "1.0mg", "frequency": "Once weekly", "notes": "Therapeutic dose for many users"},
      {"week": "13-16", "dose": "1.7mg", "frequency": "Once weekly", "notes": "Optional escalation if plateau"},
      {"week": "17+", "dose": "2.4mg", "frequency": "Once weekly", "notes": "Maximum FDA-approved dose"}
    ],
    "duration": "Ongoing with periodic reassessment",
    "notes": "Stay at each dose 4+ weeks. Only increase if weight loss plateaus and side effects are manageable. Take on same day each week."
  },
  {
    "name": "Conservative Start Protocol",
    "level": "Beginner",
    "description": "For those sensitive to GLP-1 medications",
    "schedule": [
      {"week": "1-6", "dose": "0.25mg", "frequency": "Once weekly", "notes": "Extended low-dose phase"},
      {"week": "7-12", "dose": "0.5mg", "frequency": "Once weekly", "notes": "Gradual increase"},
      {"week": "13+", "dose": "1.0mg", "frequency": "Once weekly", "notes": "May stay here long-term"}
    ],
    "duration": "Ongoing",
    "notes": "Some users achieve excellent results at lower doses with fewer side effects."
  },
  {
    "name": "Maintenance Protocol",
    "level": "Maintenance",
    "description": "After reaching goal weight",
    "schedule": [
      {"week": "Ongoing", "dose": "0.5-1.0mg", "frequency": "Once weekly", "notes": "Lowest effective dose"}
    ],
    "duration": "Long-term maintenance",
    "notes": "Find minimum dose that maintains weight. Some cycle off for 4-8 weeks periodically."
  }
]'::jsonb
WHERE name = 'Semaglutide';

-- Tirzepatide protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Standard Escalation Protocol",
    "level": "Beginner",
    "description": "FDA-approved titration for weight management",
    "schedule": [
      {"week": "1-4", "dose": "2.5mg", "frequency": "Once weekly", "notes": "Starting dose - allow adjustment"},
      {"week": "5-8", "dose": "5mg", "frequency": "Once weekly", "notes": "First therapeutic dose"},
      {"week": "9-12", "dose": "7.5mg", "frequency": "Once weekly", "notes": "Continue escalation if tolerated"},
      {"week": "13-16", "dose": "10mg", "frequency": "Once weekly", "notes": "Strong therapeutic dose"},
      {"week": "17-20", "dose": "12.5mg", "frequency": "Once weekly", "notes": "Near maximum"},
      {"week": "21+", "dose": "15mg", "frequency": "Once weekly", "notes": "Maximum dose"}
    ],
    "duration": "Ongoing with reassessment",
    "notes": "Tirzepatide shows superior weight loss vs semaglutide in trials. May not need maximum dose."
  },
  {
    "name": "Moderate Dose Protocol",
    "level": "Intermediate",
    "description": "For those achieving results at moderate doses",
    "schedule": [
      {"week": "1-4", "dose": "2.5mg", "frequency": "Once weekly", "notes": "Starting phase"},
      {"week": "5-8", "dose": "5mg", "frequency": "Once weekly", "notes": "Therapeutic level"},
      {"week": "9+", "dose": "7.5-10mg", "frequency": "Once weekly", "notes": "Maintenance range"}
    ],
    "duration": "Ongoing",
    "notes": "Many achieve 15-20% weight loss without maximum doses."
  }
]'::jsonb
WHERE name = 'Tirzepatide';

-- BPC-157 protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Standard Healing Protocol",
    "level": "Beginner",
    "description": "General healing and recovery support",
    "schedule": [
      {"week": "1-4", "dose": "250-500mcg", "frequency": "Once or twice daily", "notes": "Subcutaneous near injury site preferred"},
      {"week": "5-8", "dose": "250-500mcg", "frequency": "Once daily", "notes": "Continue or taper based on healing"}
    ],
    "duration": "4-8 weeks typical",
    "notes": "Can inject subcutaneously near injury site or systemically. Split doses (AM/PM) may enhance effects."
  },
  {
    "name": "Intensive Injury Protocol",
    "level": "Intermediate",
    "description": "For significant injuries requiring aggressive healing",
    "schedule": [
      {"week": "1-2", "dose": "500mcg", "frequency": "Twice daily", "notes": "Loading phase - morning and evening"},
      {"week": "3-6", "dose": "500mcg", "frequency": "Once daily", "notes": "Maintenance healing phase"},
      {"week": "7-8", "dose": "250mcg", "frequency": "Once daily", "notes": "Taper down"}
    ],
    "duration": "6-8 weeks",
    "notes": "Inject as close to injury site as safely possible. Combine with TB-500 for synergistic effects."
  },
  {
    "name": "Gut Healing Protocol",
    "level": "Beginner",
    "description": "For GI issues, leaky gut, IBS support",
    "schedule": [
      {"week": "1-8", "dose": "250-500mcg", "frequency": "Once daily", "notes": "Oral or subcutaneous - both effective for gut"},
      {"week": "9-12", "dose": "250mcg", "frequency": "Once daily", "notes": "Continue if beneficial"}
    ],
    "duration": "8-12 weeks",
    "notes": "Oral BPC-157 (capsules or sublingual) specifically targets GI tract. Can combine with injectable."
  }
]'::jsonb
WHERE name = 'BPC-157';

-- TB-500 protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Loading + Maintenance Protocol",
    "level": "Beginner",
    "description": "Standard approach for injury healing",
    "schedule": [
      {"week": "1-2", "dose": "2-2.5mg", "frequency": "Twice weekly", "notes": "Loading phase - 4-5mg total per week"},
      {"week": "3-6", "dose": "2mg", "frequency": "Once weekly", "notes": "Maintenance phase"}
    ],
    "duration": "6-8 weeks",
    "notes": "TB-500 is systemic - injection site does not need to be near injury. Works synergistically with BPC-157."
  },
  {
    "name": "Conservative Protocol",
    "level": "Beginner",
    "description": "Lower dose approach",
    "schedule": [
      {"week": "1-4", "dose": "2mg", "frequency": "Once weekly", "notes": "Standard weekly dose"},
      {"week": "5-8", "dose": "2mg", "frequency": "Every 2 weeks", "notes": "Reduce frequency if healing progressing"}
    ],
    "duration": "6-8 weeks",
    "notes": "Some users respond well to lower cumulative doses."
  }
]'::jsonb
WHERE name = 'TB-500 (Thymosin Beta-4)';

-- Ipamorelin protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Standard GH Support Protocol",
    "level": "Beginner",
    "description": "Daily protocol for GH optimization",
    "schedule": [
      {"week": "1+", "dose": "200-300mcg", "frequency": "1-3 times daily", "notes": "Best before bed, can add pre-workout and morning"}
    ],
    "duration": "8-12 weeks, then reassess",
    "notes": "Most effective on empty stomach. Wait 30 min before eating. Combine with CJC-1295 for enhanced effects."
  },
  {
    "name": "Combined Ipamorelin + CJC-1295 Protocol",
    "level": "Intermediate",
    "description": "Synergistic GHRH + GHRP protocol",
    "schedule": [
      {"week": "1+", "dose": "100mcg CJC + 200mcg Ipamorelin", "frequency": "2-3 times daily", "notes": "Morning, pre-workout, and/or bedtime"}
    ],
    "duration": "12 weeks on, 4 weeks off",
    "notes": "The combination amplifies GH release. Fasted state important for maximum effect."
  },
  {
    "name": "Night-Only Protocol",
    "level": "Beginner",
    "description": "Simplified once-daily approach",
    "schedule": [
      {"week": "1+", "dose": "300mcg", "frequency": "Once daily before bed", "notes": "Aligns with natural GH pulse during sleep"}
    ],
    "duration": "Ongoing with periodic breaks",
    "notes": "Easiest to maintain. Good starting point for GHRP-naive users."
  }
]'::jsonb
WHERE name = 'Ipamorelin';

-- CJC-1295 (no DAC) protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Standard Protocol with GHRP",
    "level": "Intermediate",
    "description": "Combined with Ipamorelin or GHRP-2",
    "schedule": [
      {"week": "1+", "dose": "100mcg", "frequency": "2-3 times daily with GHRP", "notes": "Always combine with a GHRP for best results"}
    ],
    "duration": "12 weeks on, 4 weeks off",
    "notes": "CJC-1295 (no DAC) should be combined with GHRP. Inject on empty stomach."
  },
  {
    "name": "Saturation Dose Protocol",
    "level": "Intermediate",
    "description": "Based on 1mcg/kg body weight saturation",
    "schedule": [
      {"week": "1+", "dose": "1mcg per kg bodyweight", "frequency": "2-3 times daily", "notes": "Example: 100mcg for 100kg person"}
    ],
    "duration": "12 weeks cycles",
    "notes": "Saturation dose concept - higher doses dont proportionally increase GH release."
  }
]'::jsonb
WHERE name = 'CJC-1295 (no DAC)';

-- CJC-1295 with DAC protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Weekly Injection Protocol",
    "level": "Beginner",
    "description": "Convenient once or twice weekly dosing",
    "schedule": [
      {"week": "1+", "dose": "2mg", "frequency": "Once or twice weekly", "notes": "Long half-life allows infrequent dosing"}
    ],
    "duration": "8-12 weeks",
    "notes": "DAC version provides sustained GH elevation. May cause water retention and numbness. Monitor IGF-1 levels."
  },
  {
    "name": "Conservative Weekly Protocol",
    "level": "Beginner",
    "description": "Lower dose approach",
    "schedule": [
      {"week": "1+", "dose": "1mg", "frequency": "Twice weekly", "notes": "Start lower to assess tolerance"}
    ],
    "duration": "Ongoing with breaks",
    "notes": "Some prefer lower doses to minimize side effects while maintaining GH elevation."
  }
]'::jsonb
WHERE name = 'CJC-1295 (DAC)';

-- Melanotan II protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Loading Protocol",
    "level": "Beginner",
    "description": "Initial loading phase for tan development",
    "schedule": [
      {"week": "1-2", "dose": "0.25-0.5mg", "frequency": "Daily", "notes": "Start low - nausea common initially"},
      {"week": "3-4", "dose": "0.5-1mg", "frequency": "Daily", "notes": "Increase based on tolerance and tanning response"}
    ],
    "duration": "3-4 weeks loading",
    "notes": "Combine with UV exposure (10-15 min). Start very low to assess nausea sensitivity."
  },
  {
    "name": "Maintenance Protocol",
    "level": "Beginner",
    "description": "After desired tan is achieved",
    "schedule": [
      {"week": "Ongoing", "dose": "0.5mg", "frequency": "1-2 times weekly", "notes": "Maintain tan with periodic UV exposure"}
    ],
    "duration": "As desired",
    "notes": "Much lower doses needed for maintenance. Tan can last months with minimal dosing."
  }
]'::jsonb
WHERE name = 'Melanotan II';

-- PT-141 protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Standard Dose Protocol",
    "level": "Beginner",
    "description": "For sexual dysfunction support",
    "schedule": [
      {"week": "As needed", "dose": "1-2mg", "frequency": "45-60 minutes before activity", "notes": "Effects last 12-72 hours"}
    ],
    "duration": "As needed",
    "notes": "Do not use more than twice weekly. Start with 1mg to assess response. Nausea is common."
  },
  {
    "name": "Low Dose Protocol",
    "level": "Beginner",
    "description": "For those sensitive to nausea",
    "schedule": [
      {"week": "As needed", "dose": "0.5-1mg", "frequency": "60 minutes before activity", "notes": "Lower doses may reduce nausea"}
    ],
    "duration": "As needed",
    "notes": "Take antiemetic if nausea is problematic. Avoid with uncontrolled hypertension."
  }
]'::jsonb
WHERE name = 'PT-141 (Bremelanotide)';

-- GHK-Cu protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Injectable Anti-Aging Protocol",
    "level": "Intermediate",
    "description": "Systemic anti-aging and healing support",
    "schedule": [
      {"week": "1-4", "dose": "1-2mg", "frequency": "Once daily", "notes": "Subcutaneous injection"},
      {"week": "5-8", "dose": "1mg", "frequency": "Once daily", "notes": "Maintenance or taper"}
    ],
    "duration": "8-12 weeks",
    "notes": "May also apply topically for localized skin effects. Monitor for copper-related effects."
  },
  {
    "name": "Topical Protocol",
    "level": "Beginner",
    "description": "For skin and hair applications",
    "schedule": [
      {"week": "Ongoing", "dose": "1-2% cream/serum", "frequency": "Once or twice daily", "notes": "Apply to target areas"}
    ],
    "duration": "Ongoing",
    "notes": "Topical application is common for cosmetic benefits. Can combine with other peptides like Argireline."
  }
]'::jsonb
WHERE name = 'GHK-Cu (Copper Peptide)';

-- MK-677 protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Standard Oral Protocol",
    "level": "Beginner",
    "description": "Daily oral dosing for GH elevation",
    "schedule": [
      {"week": "1-2", "dose": "12.5mg", "frequency": "Once daily", "notes": "Start lower to assess hunger/water retention"},
      {"week": "3+", "dose": "25mg", "frequency": "Once daily (evening preferred)", "notes": "Full dose - monitor for side effects"}
    ],
    "duration": "8-12 weeks, then break",
    "notes": "Take in evening to align with natural GH release. Causes significant hunger increase in most users."
  },
  {
    "name": "Low-Dose Protocol",
    "level": "Beginner",
    "description": "For those sensitive to side effects",
    "schedule": [
      {"week": "1+", "dose": "10-12.5mg", "frequency": "Once daily", "notes": "Lower dose, fewer side effects"}
    ],
    "duration": "Ongoing with breaks",
    "notes": "Lower doses can still elevate GH/IGF-1 with less water retention and hunger."
  }
]'::jsonb
WHERE name = 'MK-677 (Ibutamoren)';

-- Sermorelin protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Standard Anti-Aging Protocol",
    "level": "Beginner",
    "description": "Nightly dosing for GH optimization",
    "schedule": [
      {"week": "1-2", "dose": "100-200mcg", "frequency": "Once daily before bed", "notes": "Start conservative"},
      {"week": "3+", "dose": "200-300mcg", "frequency": "Once daily before bed", "notes": "Therapeutic range"}
    ],
    "duration": "3-6 months",
    "notes": "Inject on empty stomach at least 2 hours after eating. Best results when combined with good sleep hygiene."
  },
  {
    "name": "Combined with GHRP Protocol",
    "level": "Intermediate",
    "description": "Enhanced GH release with GHRP",
    "schedule": [
      {"week": "1+", "dose": "100mcg Sermorelin + 100mcg GHRP-2", "frequency": "1-2 times daily", "notes": "Morning and/or bedtime"}
    ],
    "duration": "12 weeks cycles",
    "notes": "GHRH + GHRP combination provides synergistic GH release."
  }
]'::jsonb
WHERE name = 'Sermorelin';

-- AOD-9604 protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Standard Fat Loss Protocol",
    "level": "Beginner",
    "description": "Daily dosing for fat metabolism support",
    "schedule": [
      {"week": "1+", "dose": "300mcg", "frequency": "Once daily (morning, fasted)", "notes": "Empty stomach important"}
    ],
    "duration": "8-12 weeks",
    "notes": "Best used fasted in the morning. Does not significantly affect muscle or blood glucose like full GH."
  },
  {
    "name": "Split Dose Protocol",
    "level": "Intermediate",
    "description": "Twice daily for enhanced effect",
    "schedule": [
      {"week": "1+", "dose": "250mcg", "frequency": "Twice daily (AM and pre-bed)", "notes": "Both doses fasted"}
    ],
    "duration": "8-12 weeks",
    "notes": "Some prefer split dosing for sustained fat-burning signaling."
  }
]'::jsonb
WHERE name = 'AOD-9604';

-- Epithalon protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Cycling Protocol",
    "level": "Intermediate",
    "description": "Periodic cycling approach for longevity",
    "schedule": [
      {"week": "1-2", "dose": "5-10mg", "frequency": "Once daily", "notes": "10-20 day loading period"},
      {"week": "Off", "dose": "0", "frequency": "N/A", "notes": "4-6 months off"}
    ],
    "duration": "10-20 days, repeat 2-3x per year",
    "notes": "Typically cycled rather than continuous. Effects on telomerase may persist after stopping."
  },
  {
    "name": "Extended Protocol",
    "level": "Intermediate",
    "description": "Longer duration approach",
    "schedule": [
      {"week": "1-4", "dose": "5mg", "frequency": "Every other day", "notes": "Lower cumulative dose"},
      {"week": "Off", "dose": "0", "frequency": "N/A", "notes": "4-6 months off"}
    ],
    "duration": "4 weeks, repeat 2x per year",
    "notes": "Alternative approach with longer but less intensive dosing."
  }
]'::jsonb
WHERE name = 'Epithalon';

-- Selank protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Intranasal Protocol",
    "level": "Beginner",
    "description": "Daily intranasal administration",
    "schedule": [
      {"week": "1+", "dose": "300-600mcg", "frequency": "1-3 times daily", "notes": "Intranasal spray preferred"}
    ],
    "duration": "2-4 weeks, then assess",
    "notes": "Effects are subtle and build over time. Often combined with Semax."
  },
  {
    "name": "As-Needed Anxiety Protocol",
    "level": "Beginner",
    "description": "For situational anxiety support",
    "schedule": [
      {"week": "As needed", "dose": "400-600mcg", "frequency": "As needed", "notes": "Can use before stressful situations"}
    ],
    "duration": "As needed",
    "notes": "Non-sedating anxiolytic effects. Does not cause dependence like benzodiazepines."
  }
]'::jsonb
WHERE name = 'Selank';

-- Semax protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Cognitive Enhancement Protocol",
    "level": "Beginner",
    "description": "Daily nootropic support",
    "schedule": [
      {"week": "1+", "dose": "300-600mcg", "frequency": "1-2 times daily", "notes": "Morning and early afternoon - may affect sleep if taken late"}
    ],
    "duration": "Cycle 3-4 weeks on, 1-2 weeks off",
    "notes": "Intranasal administration. Start with lower dose to assess stimulating effects."
  },
  {
    "name": "Intensive Focus Protocol",
    "level": "Intermediate",
    "description": "For demanding cognitive tasks",
    "schedule": [
      {"week": "1+", "dose": "600-1200mcg", "frequency": "Morning dose", "notes": "Higher end for acute cognitive demands"}
    ],
    "duration": "Short-term (1-2 weeks)",
    "notes": "Higher doses may cause overstimulation in some. Do not exceed 1200mcg daily."
  }
]'::jsonb
WHERE name = 'Semax';

-- DSIP protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Sleep Support Protocol",
    "level": "Beginner",
    "description": "For sleep quality improvement",
    "schedule": [
      {"week": "1+", "dose": "100-200mcg", "frequency": "30-60 minutes before bed", "notes": "Subcutaneous or IM injection"}
    ],
    "duration": "2-4 weeks, then assess",
    "notes": "Response is highly variable. Some experience improved deep sleep, others paradoxical effects."
  },
  {
    "name": "Cycling Protocol",
    "level": "Beginner",
    "description": "Intermittent use for sleep reset",
    "schedule": [
      {"week": "1", "dose": "100mcg", "frequency": "Nightly", "notes": "One week on"},
      {"week": "2-3", "dose": "0", "frequency": "N/A", "notes": "Two weeks off"}
    ],
    "duration": "Cycle as needed",
    "notes": "May be most effective when cycled to reset sleep patterns."
  }
]'::jsonb
WHERE name = 'DSIP (Delta Sleep-Inducing Peptide)';

-- Follistatin protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Muscle Growth Protocol",
    "level": "Advanced",
    "description": "For myostatin inhibition and muscle growth",
    "schedule": [
      {"week": "1-2", "dose": "100mcg", "frequency": "Once daily", "notes": "Loading phase"},
      {"week": "3-4", "dose": "100mcg", "frequency": "Every other day", "notes": "Maintenance"}
    ],
    "duration": "4-6 weeks maximum",
    "notes": "Expensive and requires careful sourcing. Effects on fertility unknown. Not for extended use."
  }
]'::jsonb
WHERE name = 'Follistatin 344';

-- Liraglutide protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Weight Management Titration",
    "level": "Beginner",
    "description": "FDA-approved Saxenda titration",
    "schedule": [
      {"week": "1", "dose": "0.6mg", "frequency": "Once daily", "notes": "Starting dose"},
      {"week": "2", "dose": "1.2mg", "frequency": "Once daily", "notes": "First increase"},
      {"week": "3", "dose": "1.8mg", "frequency": "Once daily", "notes": "Continue titration"},
      {"week": "4", "dose": "2.4mg", "frequency": "Once daily", "notes": "Near maximum"},
      {"week": "5+", "dose": "3.0mg", "frequency": "Once daily", "notes": "Maximum/maintenance dose"}
    ],
    "duration": "Ongoing",
    "notes": "Daily injection required (unlike semaglutide). Hold or reduce dose if significant GI effects."
  }
]'::jsonb
WHERE name = 'Liraglutide';

-- Thymosin Alpha-1 protocols
UPDATE public.peptides 
SET dosage_protocols = '[
  {
    "name": "Immune Support Protocol",
    "level": "Intermediate",
    "description": "For immune system optimization",
    "schedule": [
      {"week": "1-4", "dose": "1.6mg", "frequency": "Twice weekly", "notes": "Subcutaneous injection"},
      {"week": "5-12", "dose": "1.6mg", "frequency": "Once weekly", "notes": "Maintenance phase"}
    ],
    "duration": "3-6 months",
    "notes": "Used clinically for hepatitis B and as cancer adjunct therapy in some countries."
  },
  {
    "name": "Acute Immune Challenge Protocol",
    "level": "Intermediate",
    "description": "For short-term immune support",
    "schedule": [
      {"week": "1-2", "dose": "1.6mg", "frequency": "Daily", "notes": "Short-term intensive course"},
      {"week": "3-4", "dose": "1.6mg", "frequency": "Every other day", "notes": "Taper"}
    ],
    "duration": "2-4 weeks",
    "notes": "For acute situations requiring immune support. Consult healthcare provider."
  }
]'::jsonb
WHERE name = 'Thymosin Alpha-1';
