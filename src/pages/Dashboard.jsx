import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Syringe, Calendar, ArrowRight, TrendingDown } from 'lucide-react';
import { useInjections } from '../hooks/useInjections';
import { useAuth } from '../context/AuthContext';
import ProgressAnalytics from '../components/ProgressAnalytics';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const { getStats } = useInjections();
    const { user } = useAuth();

    const stats = useMemo(() => getStats(), [getStats]);

    // Get user's first name for greeting
    const userName = useMemo(() => {
        if (!user) return 'Guest';
        const fullName = user.user_metadata?.full_name || user.email || 'User';
        return fullName.split(' ')[0].split('@')[0];
    }, [user]);

    return (
        <div className="padding-container" style={{ padding: '20px' }}>
            <header className={styles.header}>
                <h1>Hello, {userName}</h1>
                <p className={styles.subtitle}>Here's your peptide summary</p>
            </header>

            <div className={styles.grid}>
                <div className={`card ${styles.summaryCard}`}>
                    <div className={styles.cardIcon}>
                        <Activity size={24} color="#8b5cf6" />
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.label}>Est. Active Level</span>
                        <span className={styles.value}>
                            {stats ? stats.activeLevel : '0.00'} <span className={styles.unit}>mg</span>
                        </span>
                    </div>
                </div>

                <div className={`card ${styles.summaryCard}`}>
                    <div className={styles.cardIcon}>
                        <Calendar size={24} color="#ec4899" />
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.label}>Last Injection</span>
                        <span className={styles.value}>
                            {stats ? new Date(stats.lastInjection.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '--'}
                        </span>
                        {stats && <span className={styles.subtext}>{stats.lastInjection.peptide}</span>}
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h3>Quick Actions</h3>
                <div className={styles.actions}>
                    <Link to="/tracker" className={`card ${styles.actionCard}`}>
                        <div className={styles.actionIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                            <Syringe size={24} />
                        </div>
                        <div className={styles.actionText}>
                            <span className={styles.actionTitle}>Log Injection</span>
                            <span className={styles.actionDesc}>Record a new dose</span>
                        </div>
                        <ArrowRight size={20} className={styles.arrow} />
                    </Link>

                    <Link to="/calculator" className={`card ${styles.actionCard}`}>
                        <div className={styles.actionIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                            <Activity size={24} />
                        </div>
                        <div className={styles.actionText}>
                            <span className={styles.actionTitle}>Calculator</span>
                            <span className={styles.actionDesc}>Reconstitute peptides</span>
                        </div>
                        <ArrowRight size={20} className={styles.arrow} />
                    </Link>

                    <Link to="/price-checker" className={`card ${styles.actionCard}`}>
                        <div className={styles.actionIcon} style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                            <TrendingDown size={24} />
                        </div>
                        <div className={styles.actionText}>
                            <span className={styles.actionTitle}>Price Checker</span>
                            <span className={styles.actionDesc}>Compare vendor prices</span>
                        </div>
                        <ArrowRight size={20} className={styles.arrow} />
                    </Link>
                </div>
            </div>

            {/* Progress Analytics Section */}
            <div className={styles.section}>
                <ProgressAnalytics />
            </div>
        </div>
    );
};

export default Dashboard;
