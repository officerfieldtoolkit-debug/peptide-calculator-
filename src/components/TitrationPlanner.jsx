import React, { useState, useMemo } from 'react';
import { Calendar, ChevronRight, Lock, Download, Share2, AlertTriangle, Check, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './TitrationPlanner.module.css';

// Predefined titration protocols
const titrationProtocols = {
    semaglutide: {
        name: 'Semaglutide (Ozempic/Wegovy)',
        category: 'GLP-1 Agonist',
        frequency: 'Weekly',
        protocols: [
            {
                name: 'Standard FDA Protocol',
                description: 'FDA-approved escalation for weight management',
                steps: [
                    { week: 1, duration: 4, dose: 0.25, unit: 'mg', notes: 'Starting dose - expect some nausea' },
                    { week: 5, duration: 4, dose: 0.5, unit: 'mg', notes: 'First increase' },
                    { week: 9, duration: 4, dose: 1.0, unit: 'mg', notes: 'Therapeutic dose' },
                    { week: 13, duration: 4, dose: 1.7, unit: 'mg', notes: 'Optional increase' },
                    { week: 17, duration: 0, dose: 2.4, unit: 'mg', notes: 'Maximum dose' },
                ]
            },
            {
                name: 'Slow Titration',
                description: 'For those sensitive to GI effects',
                steps: [
                    { week: 1, duration: 6, dose: 0.25, unit: 'mg', notes: 'Extended starting phase' },
                    { week: 7, duration: 6, dose: 0.5, unit: 'mg', notes: 'Gradual increase' },
                    { week: 13, duration: 0, dose: 1.0, unit: 'mg', notes: 'May stay here long-term' },
                ]
            }
        ]
    },
    tirzepatide: {
        name: 'Tirzepatide (Mounjaro/Zepbound)',
        category: 'GIP/GLP-1 Dual Agonist',
        frequency: 'Weekly',
        protocols: [
            {
                name: 'Standard Protocol',
                description: 'FDA-approved titration',
                steps: [
                    { week: 1, duration: 4, dose: 2.5, unit: 'mg', notes: 'Starting dose' },
                    { week: 5, duration: 4, dose: 5, unit: 'mg', notes: 'First therapeutic dose' },
                    { week: 9, duration: 4, dose: 7.5, unit: 'mg', notes: 'Increase if tolerated' },
                    { week: 13, duration: 4, dose: 10, unit: 'mg', notes: 'Strong therapeutic dose' },
                    { week: 17, duration: 4, dose: 12.5, unit: 'mg', notes: 'Near maximum' },
                    { week: 21, duration: 0, dose: 15, unit: 'mg', notes: 'Maximum approved dose' },
                ]
            }
        ]
    },
    liraglutide: {
        name: 'Liraglutide (Saxenda)',
        category: 'GLP-1 Agonist',
        frequency: 'Daily',
        protocols: [
            {
                name: 'Standard Daily Protocol',
                description: 'FDA-approved daily titration',
                steps: [
                    { week: 1, duration: 1, dose: 0.6, unit: 'mg', notes: 'Week 1' },
                    { week: 2, duration: 1, dose: 1.2, unit: 'mg', notes: 'Week 2' },
                    { week: 3, duration: 1, dose: 1.8, unit: 'mg', notes: 'Week 3' },
                    { week: 4, duration: 1, dose: 2.4, unit: 'mg', notes: 'Week 4' },
                    { week: 5, duration: 0, dose: 3.0, unit: 'mg', notes: 'Maintenance dose' },
                ]
            }
        ]
    },
    retatrutide: {
        name: 'Retatrutide',
        category: 'Triple Agonist',
        frequency: 'Weekly',
        protocols: [
            {
                name: 'Clinical Trial Protocol',
                description: 'Based on phase 2 trial escalation',
                steps: [
                    { week: 1, duration: 4, dose: 1, unit: 'mg', notes: 'Low starting dose' },
                    { week: 5, duration: 4, dose: 2, unit: 'mg', notes: 'First increase' },
                    { week: 9, duration: 4, dose: 4, unit: 'mg', notes: 'Mid-range dose' },
                    { week: 13, duration: 4, dose: 8, unit: 'mg', notes: 'Higher dose' },
                    { week: 17, duration: 0, dose: 12, unit: 'mg', notes: 'Maximum studied' },
                ]
            }
        ]
    },
    mk677: {
        name: 'MK-677 (Ibutamoren)',
        category: 'GH Secretagogue',
        frequency: 'Daily (Oral)',
        protocols: [
            {
                name: 'Standard Protocol',
                description: 'Common dosing approach',
                steps: [
                    { week: 1, duration: 2, dose: 12.5, unit: 'mg', notes: 'Half dose to assess tolerance' },
                    { week: 3, duration: 0, dose: 25, unit: 'mg', notes: 'Full dose - take at night' },
                ]
            },
            {
                name: 'Low Dose Protocol',
                description: 'For those experiencing side effects',
                steps: [
                    { week: 1, duration: 0, dose: 10, unit: 'mg', notes: 'Lower dose, fewer sides' },
                ]
            }
        ]
    }
};

const TitrationPlanner = ({ isPremium = false }) => {
    const { user } = useAuth();
    const [selectedDrug, setSelectedDrug] = useState('semaglutide');
    const [selectedProtocol, setSelectedProtocol] = useState(0);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentWeight, setCurrentWeight] = useState('');
    const [goalWeight, setGoalWeight] = useState('');

    // Check if premium feature
    if (!isPremium) {
        return (
            <div className={styles.premiumGate}>
                <div className={styles.premiumCard}>
                    <Lock size={48} className={styles.lockIcon} />
                    <h2>Premium Feature</h2>
                    <p>Titration Planner is a premium feature that helps you:</p>
                    <ul>
                        <li>Plan your dose escalation schedule</li>
                        <li>Get calendar reminders for dose changes</li>
                        <li>Track your progress and adjust as needed</li>
                        <li>Export your plan to share with your doctor</li>
                        <li>Access FDA-approved and alternative protocols</li>
                    </ul>
                    <button className={styles.upgradeBtn}>
                        Upgrade to Premium
                    </button>
                </div>
            </div>
        );
    }

    const drug = titrationProtocols[selectedDrug];
    const protocol = drug.protocols[selectedProtocol];

    // Generate schedule based on start date
    const schedule = useMemo(() => {
        const result = [];
        let currentDate = new Date(startDate);

        protocol.steps.forEach((step, index) => {
            const stepStartDate = new Date(currentDate);
            const stepEndDate = step.duration > 0
                ? new Date(currentDate.setDate(currentDate.getDate() + (step.duration * 7) - 1))
                : null;

            result.push({
                ...step,
                startDate: stepStartDate,
                endDate: stepEndDate,
                weekNumber: step.week,
                isFirst: index === 0,
                isLast: index === protocol.steps.length - 1,
            });

            if (step.duration > 0) {
                currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
            }
        });

        return result;
    }, [startDate, protocol]);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const isCurrentStep = (step) => {
        const today = new Date();
        if (step.endDate) {
            return today >= step.startDate && today <= step.endDate;
        }
        return today >= step.startDate;
    };

    const isPastStep = (step) => {
        const today = new Date();
        if (step.endDate) {
            return today > step.endDate;
        }
        return false;
    };

    const handleExport = () => {
        const text = `${drug.name} Titration Plan\n` +
            `Protocol: ${protocol.name}\n` +
            `Start Date: ${formatDate(new Date(startDate))}\n\n` +
            schedule.map(step =>
                `Week ${step.weekNumber}: ${step.dose}${step.unit} - Starting ${formatDate(step.startDate)}` +
                (step.endDate ? ` to ${formatDate(step.endDate)}` : ' (ongoing)') +
                `\n  Notes: ${step.notes}`
            ).join('\n\n');

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `titration-plan-${selectedDrug}.txt`;
        a.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Titration Planner</h1>
                    <p className={styles.subtitle}>Plan and track your dose escalation schedule</p>
                </div>
                <button className={styles.exportBtn} onClick={handleExport}>
                    <Download size={18} />
                    Export Plan
                </button>
            </div>

            <div className={styles.setupGrid}>
                <div className={styles.setupCard}>
                    <h3>Select Medication</h3>
                    <select
                        value={selectedDrug}
                        onChange={(e) => {
                            setSelectedDrug(e.target.value);
                            setSelectedProtocol(0);
                        }}
                        className={styles.select}
                    >
                        {Object.entries(titrationProtocols).map(([key, value]) => (
                            <option key={key} value={key}>{value.name}</option>
                        ))}
                    </select>
                    <span className={styles.drugCategory}>{drug.category} • {drug.frequency}</span>
                </div>

                <div className={styles.setupCard}>
                    <h3>Select Protocol</h3>
                    <select
                        value={selectedProtocol}
                        onChange={(e) => setSelectedProtocol(parseInt(e.target.value))}
                        className={styles.select}
                    >
                        {drug.protocols.map((p, i) => (
                            <option key={i} value={i}>{p.name}</option>
                        ))}
                    </select>
                    <span className={styles.protocolDesc}>{protocol.description}</span>
                </div>

                <div className={styles.setupCard}>
                    <h3>Start Date</h3>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={styles.dateInput}
                    />
                </div>

                <div className={styles.setupCard}>
                    <h3>Weight Tracking (Optional)</h3>
                    <div className={styles.weightInputs}>
                        <div>
                            <label>Current</label>
                            <input
                                type="number"
                                placeholder="lbs"
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(e.target.value)}
                            />
                        </div>
                        <ChevronRight size={20} className={styles.arrow} />
                        <div>
                            <label>Goal</label>
                            <input
                                type="number"
                                placeholder="lbs"
                                value={goalWeight}
                                onChange={(e) => setGoalWeight(e.target.value)}
                            />
                        </div>
                    </div>
                    {currentWeight && goalWeight && (
                        <span className={styles.weightDiff}>
                            Target loss: {currentWeight - goalWeight} lbs ({Math.round((currentWeight - goalWeight) / currentWeight * 100)}%)
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.timeline}>
                <h2>Your Titration Schedule</h2>

                <div className={styles.steps}>
                    {schedule.map((step, index) => (
                        <div
                            key={index}
                            className={`${styles.stepCard} ${isCurrentStep(step) ? styles.current : ''} ${isPastStep(step) ? styles.past : ''}`}
                        >
                            <div className={styles.stepIndicator}>
                                {isPastStep(step) ? (
                                    <Check size={16} />
                                ) : isCurrentStep(step) ? (
                                    <div className={styles.currentDot} />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>

                            <div className={styles.stepContent}>
                                <div className={styles.stepHeader}>
                                    <span className={styles.stepDose}>{step.dose} {step.unit}</span>
                                    <span className={styles.stepWeek}>Week {step.weekNumber}{step.duration > 0 ? `-${step.weekNumber + step.duration - 1}` : '+'}</span>
                                </div>

                                <div className={styles.stepDates}>
                                    <Calendar size={14} />
                                    {formatDate(step.startDate)}
                                    {step.endDate && ` → ${formatDate(step.endDate)}`}
                                    {!step.endDate && ' → Ongoing'}
                                </div>

                                <p className={styles.stepNotes}>{step.notes}</p>

                                {isCurrentStep(step) && (
                                    <div className={styles.currentBadge}>
                                        <AlertTriangle size={14} />
                                        Current Phase
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.infoBox}>
                <Info size={20} />
                <div>
                    <h4>Important Reminders</h4>
                    <ul>
                        <li>Only increase dose if you're tolerating current dose well</li>
                        <li>Stay at current dose longer if experiencing significant side effects</li>
                        <li>Consult your healthcare provider before making changes</li>
                        <li>This planner is for reference only - follow your provider's guidance</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TitrationPlanner;
