/**
 * Peptide Interaction Rules
 * 
 * Types:
 * - DANGER: Serious risk, avoid combination
 * - WARNING: Potential side effects or redundancy
 * - SYNERGY: Beneficial combination
 * - INFO: General information about the combo
 */

export const INTERACTION_RULES = [
    // GLP-1 Redundancy/Danger
    {
        peptides: ['semaglutide', 'tirzepatide', 'retatrutide', 'liraglutide', 'exenatide', 'dulaglutide'],
        minMatches: 2,
        type: 'WARNING',
        title: 'Multiple GLP-1 Agonists',
        description: 'Combining multiple GLP-1 receptor agonists increases the risk of severe gastrointestinal side effects (nausea, vomiting) and hypoglycemia. Most protocols use only one strong GLP-1 agonist at a time.'
    },

    // GHRH + GHRP Synergy (The classic stack)
    {
        groupA: ['cjc-1295', 'cjc-1295-no-dac', 'mod-grf', 'sermorelin', 'tesamorelin'],
        groupB: ['ipamorelin', 'ghrp-2', 'ghrp-6', 'hexarelin', 'mk-677'],
        type: 'SYNERGY',
        title: 'GHRH + GHRP Synergy',
        description: 'Combining a GHRH (Growth Hormone Releasing Hormone) with a GHRP (Growth Hormone Releasing Peptide) creates a synergistic effect, releasing significantly more growth hormone than either peptide alone. This is a highly effective stack.'
    },

    // Healing Stack
    {
        required: ['bpc-157', 'tb-500'],
        type: 'SYNERGY',
        title: 'The "Wolverine" Healing Stack',
        description: 'BPC-157 and TB-500 are standardly used together for injury recovery. BPC-157 works locally and systemically for soft tissue repair, while TB-500 improves cell migration and actin upregulation. They complement each other perfectly.'
    },

    // Fragment + GHS
    {
        groupA: ['fragment-176-191', 'aod-9604'],
        groupB: ['ipamorelin', 'ghrp-2', 'hexarelin', 'cjc-1295'],
        type: 'INFO',
        title: 'Fat Loss Stack',
        description: 'Combining a fat-liberating peptide (Frag 176-191 or AOD-9604) with a GH secretagogue can enhance fat loss results, as increased GH levels also promote lipolysis.'
    },

    // Melanotan Warning
    {
        peptides: ['melanotan-1', 'melanotan-2', 'pt-141'],
        minMatches: 2,
        type: 'WARNING',
        title: 'Multiple Melanocortin Agonists',
        description: 'Stacking multiple melanocortin agonists (MT1, MT2, PT-141) can lead to excessive nausea, flushing, and potentially unsafe spikes in blood pressure. Use one at a time.'
    }
];

export const PEPTIDE_CATEGORIES = {
    'Weight Loss': ['semaglutide', 'tirzepatide', 'retatrutide', 'tesofensine', 'aod-9604', '5-amino-1mq'],
    'Growth & Muscle': ['cjc-1295', 'ipamorelin', 'mk-677', 'ghrp-6', 'ghrp-2', 'tesamorelin', 'igf-1-lr3'],
    'Healing': ['bpc-157', 'tb-500', 'ghk-cu', 'thymosin-alpha-1', 'll-37'],
    'Cognitive': ['semax', 'selank', 'p21', 'dihexa', 'cerebrolysin'],
    'Longevity': ['epithalon', 'mots-c', 'ss-31', 'nad+'],
    'Sexual Health': ['pt-141', 'melanotan-2', 'kisspeptin-10']
};
