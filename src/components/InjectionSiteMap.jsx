import React, { useState } from 'react';
import styles from './InjectionSiteMap.module.css';

const injectionSites = {
    subcutaneous: [
        {
            id: 'abdomen',
            name: 'Abdomen',
            x: 50, y: 42,
            description: 'Most common site. 2 inches from navel.',
            tips: ['Rotate within a 2-inch radius', 'Pinch skin before injecting', 'Avoid scar tissue'],
            peptides: ['Semaglutide', 'Tirzepatide', 'BPC-157', 'Most peptides'],
            difficulty: 'Easy'
        },
        {
            id: 'thigh-front-left',
            name: 'Front Thigh (Left)',
            x: 42, y: 68,
            description: 'Middle third of outer thigh.',
            tips: ['Sit down for easier access', 'Inject into fatty area', 'Alternate legs'],
            peptides: ['All subcutaneous peptides'],
            difficulty: 'Easy'
        },
        {
            id: 'thigh-front-right',
            name: 'Front Thigh (Right)',
            x: 58, y: 68,
            description: 'Middle third of outer thigh.',
            tips: ['Sit down for easier access', 'Inject into fatty area', 'Alternate legs'],
            peptides: ['All subcutaneous peptides'],
            difficulty: 'Easy'
        },
        {
            id: 'upper-arm-left',
            name: 'Upper Arm (Left)',
            x: 22, y: 32,
            description: 'Back of upper arm, tricep area.',
            tips: ['May need assistance', 'Pinch skin firmly', 'Good for thin individuals'],
            peptides: ['GLP-1 agonists', 'Growth hormone peptides'],
            difficulty: 'Moderate'
        },
        {
            id: 'upper-arm-right',
            name: 'Upper Arm (Right)',
            x: 78, y: 32,
            description: 'Back of upper arm, tricep area.',
            tips: ['May need assistance', 'Pinch skin firmly', 'Good for thin individuals'],
            peptides: ['GLP-1 agonists', 'Growth hormone peptides'],
            difficulty: 'Moderate'
        },
        {
            id: 'love-handle-left',
            name: 'Flank/Love Handle (Left)',
            x: 30, y: 45,
            description: 'Side of abdomen/waist area.',
            tips: ['Good alternative to abdomen', 'Rotate with other sites'],
            peptides: ['All subcutaneous peptides'],
            difficulty: 'Easy'
        },
        {
            id: 'love-handle-right',
            name: 'Flank/Love Handle (Right)',
            x: 70, y: 45,
            description: 'Side of abdomen/waist area.',
            tips: ['Good alternative to abdomen', 'Rotate with other sites'],
            peptides: ['All subcutaneous peptides'],
            difficulty: 'Easy'
        }
    ],
    intramuscular: [
        {
            id: 'deltoid-left',
            name: 'Deltoid (Left)',
            x: 20, y: 26,
            description: 'Side of shoulder muscle.',
            tips: ['Locate 2-3 finger widths below acromion', 'Small volume only (1-2ml)', 'Relax arm'],
            peptides: ['TB-500', 'IGF-1', 'Some GH peptides'],
            difficulty: 'Moderate'
        },
        {
            id: 'deltoid-right',
            name: 'Deltoid (Right)',
            x: 80, y: 26,
            description: 'Side of shoulder muscle.',
            tips: ['Locate 2-3 finger widths below acromion', 'Small volume only (1-2ml)', 'Relax arm'],
            peptides: ['TB-500', 'IGF-1', 'Some GH peptides'],
            difficulty: 'Moderate'
        },
        {
            id: 'glute-left',
            name: 'Gluteus (Left)',
            x: 35, y: 52,
            description: 'Upper outer quadrant of buttock.',
            tips: ['Largest muscle - can handle larger volumes', 'Stand with weight on opposite leg', 'Locate upper outer quadrant'],
            peptides: ['TB-500', 'Large volume injections'],
            difficulty: 'Moderate'
        },
        {
            id: 'glute-right',
            name: 'Gluteus (Right)',
            x: 65, y: 52,
            description: 'Upper outer quadrant of buttock.',
            tips: ['Largest muscle - can handle larger volumes', 'Stand with weight on opposite leg', 'Locate upper outer quadrant'],
            peptides: ['TB-500', 'Large volume injections'],
            difficulty: 'Moderate'
        },
        {
            id: 'vastus-left',
            name: 'Vastus Lateralis (Left)',
            x: 40, y: 65,
            description: 'Outer middle thigh.',
            tips: ['Divide thigh into thirds, use middle third', 'Easy to self-administer', 'Can handle moderate volumes'],
            peptides: ['Growth factors', 'MGF for local effect'],
            difficulty: 'Easy'
        },
        {
            id: 'vastus-right',
            name: 'Vastus Lateralis (Right)',
            x: 60, y: 65,
            description: 'Outer middle thigh.',
            tips: ['Divide thigh into thirds, use middle third', 'Easy to self-administer', 'Can handle moderate volumes'],
            peptides: ['Growth factors', 'MGF for local effect'],
            difficulty: 'Easy'
        }
    ]
};

const InjectionSiteMap = () => {
    const [selectedType, setSelectedType] = useState('subcutaneous');
    const [selectedSite, setSelectedSite] = useState(null);
    const [viewMode, setViewMode] = useState('front'); // front or back

    const sites = injectionSites[selectedType] || [];

    const handleSiteClick = (site) => {
        setSelectedSite(site);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'var(--success)';
            case 'Moderate': return 'var(--warning)';
            case 'Advanced': return 'var(--error)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Injection Site Guide</h1>
                <p className={styles.subtitle}>
                    Interactive guide to safe injection sites for peptide administration
                </p>
            </div>

            <div className={styles.controls}>
                <div className={styles.typeToggle}>
                    <button
                        className={`${styles.toggleBtn} ${selectedType === 'subcutaneous' ? styles.active : ''}`}
                        onClick={() => setSelectedType('subcutaneous')}
                    >
                        Subcutaneous (SubQ)
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${selectedType === 'intramuscular' ? styles.active : ''}`}
                        onClick={() => setSelectedType('intramuscular')}
                    >
                        Intramuscular (IM)
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.bodyContainer}>
                    {/* Body outline SVG */}
                    <svg viewBox="0 0 100 100" className={styles.bodySvg}>
                        {/* Simple body outline */}
                        <ellipse cx="50" cy="12" rx="8" ry="10" className={styles.bodyOutline} /> {/* Head */}
                        <rect x="42" y="22" width="16" height="4" rx="2" className={styles.bodyOutline} /> {/* Neck */}
                        <ellipse cx="50" cy="40" rx="18" ry="16" className={styles.bodyOutline} /> {/* Torso */}
                        <ellipse cx="24" cy="35" rx="6" ry="18" className={styles.bodyOutline} /> {/* Left arm */}
                        <ellipse cx="76" cy="35" rx="6" ry="18" className={styles.bodyOutline} /> {/* Right arm */}
                        <ellipse cx="42" cy="72" rx="8" ry="22" className={styles.bodyOutline} /> {/* Left leg */}
                        <ellipse cx="58" cy="72" rx="8" ry="22" className={styles.bodyOutline} /> {/* Right leg */}

                        {/* Injection site markers */}
                        {sites.map((site) => (
                            <g key={site.id} onClick={() => handleSiteClick(site)} className={styles.siteMarker}>
                                <circle
                                    cx={site.x}
                                    cy={site.y}
                                    r={selectedSite?.id === site.id ? 4 : 3}
                                    className={`${styles.siteDot} ${selectedSite?.id === site.id ? styles.selected : ''}`}
                                />
                                <circle
                                    cx={site.x}
                                    cy={site.y}
                                    r={6}
                                    className={styles.siteHitArea}
                                />
                            </g>
                        ))}
                    </svg>

                    {/* Site labels */}
                    <div className={styles.siteLabels}>
                        {sites.map((site) => (
                            <button
                                key={site.id}
                                className={`${styles.siteLabel} ${selectedSite?.id === site.id ? styles.active : ''}`}
                                onClick={() => handleSiteClick(site)}
                            >
                                {site.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.infoPanel}>
                    {selectedSite ? (
                        <>
                            <div className={styles.siteHeader}>
                                <h2 className={styles.siteName}>{selectedSite.name}</h2>
                                <span
                                    className={styles.difficulty}
                                    style={{ color: getDifficultyColor(selectedSite.difficulty) }}
                                >
                                    {selectedSite.difficulty}
                                </span>
                            </div>

                            <p className={styles.siteDescription}>{selectedSite.description}</p>

                            <div className={styles.section}>
                                <h3>Injection Tips</h3>
                                <ul className={styles.tipsList}>
                                    {selectedSite.tips.map((tip, i) => (
                                        <li key={i}>{tip}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.section}>
                                <h3>Recommended For</h3>
                                <div className={styles.peptideTags}>
                                    {selectedSite.peptides.map((peptide, i) => (
                                        <span key={i} className={styles.peptideTag}>{peptide}</span>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.section}>
                                <h3>Administration Type</h3>
                                <p className={styles.adminType}>
                                    {selectedType === 'subcutaneous'
                                        ? '💉 Subcutaneous - Into fatty tissue layer beneath skin'
                                        : '💪 Intramuscular - Into the muscle tissue'}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className={styles.placeholder}>
                            <div className={styles.placeholderIcon}>👆</div>
                            <p>Click on a site marker to view detailed injection information</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.legend}>
                <h3>General Guidelines</h3>
                <div className={styles.guidelines}>
                    <div className={styles.guideline}>
                        <span className={styles.guideIcon}>🔄</span>
                        <span>Rotate injection sites to prevent lipodystrophy</span>
                    </div>
                    <div className={styles.guideline}>
                        <span className={styles.guideIcon}>🧴</span>
                        <span>Clean site with alcohol swab before injection</span>
                    </div>
                    <div className={styles.guideline}>
                        <span className={styles.guideIcon}>📏</span>
                        <span>SubQ: 1/2" needle at 45° | IM: 1-1.5" needle at 90°</span>
                    </div>
                    <div className={styles.guideline}>
                        <span className={styles.guideIcon}>⚠️</span>
                        <span>Avoid injecting into bruised, scarred, or irritated skin</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InjectionSiteMap;
