import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useInjections } from '../hooks/useInjections';
import { Activity } from 'lucide-react';
import styles from './HalfLifePlotter.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PEPTIDE_PRESETS = {
    'Semaglutide': 168, // 7 days in hours
    'Tirzepatide': 120, // 5 days
    'Retatrutide': 144, // 6 days
    'CJC-1295': 0.5,    // 30 mins (DAC is longer)
    'Ipamorelin': 2,    // 2 hours
    'BPC-157': 4,       // ~4 hours
    'Custom': 24
};

const HalfLifePlotter = () => {
    const { injections } = useInjections();
    const [selectedPeptide, setSelectedPeptide] = useState('Semaglutide');
    const [customHalfLife, setCustomHalfLife] = useState(24);
    const [daysToProject, setDaysToProject] = useState(30);

    const halfLifeHours = selectedPeptide === 'Custom' ? customHalfLife : PEPTIDE_PRESETS[selectedPeptide];

    const chartData = useMemo(() => {
        if (injections.length === 0) return null;

        // Filter injections by selected peptide name (simple matching)
        // If 'Custom', we might want to show all or let user filter. 
        // For now, let's filter by the selected preset name if it's not Custom.
        const relevantInjections = selectedPeptide === 'Custom'
            ? injections
            : injections.filter(i => i.peptide.toLowerCase().includes(selectedPeptide.toLowerCase()));

        if (relevantInjections.length === 0) return null;

        // Generate time points (daily for now)
        const now = new Date();
        const startDate = new Date(Math.min(...relevantInjections.map(i => new Date(i.date))));
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + daysToProject);

        const labels = [];
        const dataPoints = [];

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            labels.push(currentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

            // Calculate total active amount at this time point
            let totalActive = 0;
            const currentTime = currentDate.getTime();

            relevantInjections.forEach(inj => {
                const injTime = new Date(inj.date).getTime();
                if (injTime <= currentTime) {
                    const elapsedHours = (currentTime - injTime) / (1000 * 60 * 60);
                    const remaining = inj.dosage * Math.pow(0.5, elapsedHours / halfLifeHours);
                    totalActive += remaining;
                }
            });

            dataPoints.push(totalActive);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Estimated Active Level (mg)',
                    data: dataPoints,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 2,
                },
            ],
        };
    }, [injections, halfLifeHours, daysToProject, selectedPeptide]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    maxTicksLimit: 8,
                },
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div className={styles.controlGroup}>
                    <label>Peptide Profile</label>
                    <select
                        value={selectedPeptide}
                        onChange={(e) => setSelectedPeptide(e.target.value)}
                    >
                        {Object.keys(PEPTIDE_PRESETS).map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                {selectedPeptide === 'Custom' && (
                    <div className={styles.controlGroup}>
                        <label>Half-Life (Hours)</label>
                        <input
                            type="number"
                            value={customHalfLife}
                            onChange={(e) => setCustomHalfLife(Number(e.target.value))}
                        />
                    </div>
                )}
            </div>

            <div className="card glass-panel">
                <div className={styles.chartHeader}>
                    <Activity size={20} color="var(--accent-primary)" />
                    <h3>Decay Plotter</h3>
                </div>

                <div className={styles.chartContainer}>
                    {chartData ? (
                        <Line data={chartData} options={options} />
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No data for selected peptide.</p>
                            <small>Log an injection with the name "{selectedPeptide}" to see the graph.</small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HalfLifePlotter;
