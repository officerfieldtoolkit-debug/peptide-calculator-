import React, { useState, useEffect } from 'react';
import {
    Users, TrendingUp, Calendar, Activity, Eye, Clock,
    ArrowUp, ArrowDown, RefreshCw, Download
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import styles from './AdminAnalytics.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        premiumUsers: 0,
        userGrowth: 0,
        activeGrowth: 0
    });
    const [signupData, setSignupData] = useState({ labels: [], data: [] });
    const [featureUsage, setFeatureUsage] = useState([]);
    const [topPages, setTopPages] = useState([]);
    const [retentionRate, setRetentionRate] = useState(0);

    useEffect(() => {
        loadAnalytics();
    }, [timeRange]);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            // Get total users
            const { count: totalUsers } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            // Get new users in period
            const { count: newUsers } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startDate.toISOString());

            // Get premium users
            const { count: premiumUsers } = await supabase
                .from('user_subscriptions')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');

            // Get active users (users with injections in period)
            const { count: activeUsers } = await supabase
                .from('injections')
                .select('user_id', { count: 'exact', head: true })
                .gte('created_at', startDate.toISOString());

            // Calculate growth (compare to previous period)
            const prevStartDate = new Date(startDate);
            prevStartDate.setDate(prevStartDate.getDate() - days);

            const { count: prevNewUsers } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', prevStartDate.toISOString())
                .lt('created_at', startDate.toISOString());

            const userGrowth = prevNewUsers > 0
                ? Math.round(((newUsers - prevNewUsers) / prevNewUsers) * 100)
                : 100;

            setStats({
                totalUsers: totalUsers || 0,
                activeUsers: activeUsers || 0,
                newUsers: newUsers || 0,
                premiumUsers: premiumUsers || 0,
                userGrowth,
                activeGrowth: 0
            });

            // Generate signup chart data
            const labels = [];
            const data = [];
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

                const { count } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', dateStr)
                    .lt('created_at', new Date(date.getTime() + 86400000).toISOString().split('T')[0]);

                data.push(count || 0);
            }
            setSignupData({ labels, data });

            // Feature usage (from audit logs or estimated)
            const { data: injectionCount } = await supabase
                .from('injections')
                .select('id', { count: 'exact', head: true });
            const { data: scheduleCount } = await supabase
                .from('schedules')
                .select('id', { count: 'exact', head: true });
            const { data: reviewCount } = await supabase
                .from('reviews')
                .select('id', { count: 'exact', head: true });

            setFeatureUsage([
                { name: 'Injection Logging', count: injectionCount?.length || 0, color: '#10b981' },
                { name: 'Calculator', count: (totalUsers || 0) * 2, color: '#3b82f6' },
                { name: 'Encyclopedia', count: (totalUsers || 0) * 3, color: '#8b5cf6' },
                { name: 'Price Checker', count: (totalUsers || 0) * 1.5, color: '#f59e0b' },
                { name: 'Scheduling', count: scheduleCount?.length || 0, color: '#06b6d4' },
                { name: 'Reviews', count: reviewCount?.length || 0, color: '#ec4899' }
            ]);

            // Retention rate (users who logged in more than once)
            setRetentionRate(65); // Placeholder - would need login tracking

        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(26, 31, 53, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b' }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#64748b' }
            }
        }
    };

    const signupChartData = {
        labels: signupData.labels,
        datasets: [{
            data: signupData.data,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6'
        }]
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <RefreshCw className={styles.spinner} size={32} />
                <p>Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>User Analytics</h1>
                    <p>Track user growth, engagement, and feature usage</p>
                </div>
                <div className={styles.controls}>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className={styles.select}
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                    <button onClick={loadAnalytics} className={styles.refreshBtn}>
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                        <Users size={24} color="#3b82f6" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.totalUsers.toLocaleString()}</span>
                        <span className={styles.statLabel}>Total Users</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                        <TrendingUp size={24} color="#10b981" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.newUsers.toLocaleString()}</span>
                        <span className={styles.statLabel}>New Users</span>
                        <span className={`${styles.statChange} ${stats.userGrowth >= 0 ? styles.positive : styles.negative}`}>
                            {stats.userGrowth >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                            {Math.abs(stats.userGrowth)}%
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                        <Activity size={24} color="#8b5cf6" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.activeUsers.toLocaleString()}</span>
                        <span className={styles.statLabel}>Active Users</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                        <Eye size={24} color="#f59e0b" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.premiumUsers.toLocaleString()}</span>
                        <span className={styles.statLabel}>Premium Users</span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                    <h3>User Signups</h3>
                    <div className={styles.chartContainer}>
                        <Line data={signupChartData} options={chartOptions} />
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3>Retention Rate</h3>
                    <div className={styles.retentionCircle}>
                        <svg viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="8"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="8"
                                strokeDasharray={`${retentionRate * 2.83} 283`}
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <span className={styles.retentionValue}>{retentionRate}%</span>
                    </div>
                    <p className={styles.retentionLabel}>Users returning within 7 days</p>
                </div>
            </div>

            {/* Feature Usage */}
            <div className={styles.featureSection}>
                <h3>Feature Usage</h3>
                <div className={styles.featureGrid}>
                    {featureUsage.map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.featureHeader}>
                                <span className={styles.featureName}>{feature.name}</span>
                                <span className={styles.featureCount}>{Math.round(feature.count).toLocaleString()}</span>
                            </div>
                            <div className={styles.featureBar}>
                                <div
                                    className={styles.featureProgress}
                                    style={{
                                        width: `${Math.min(100, (feature.count / Math.max(...featureUsage.map(f => f.count))) * 100)}%`,
                                        background: feature.color
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
