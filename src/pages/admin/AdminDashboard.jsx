import React, { useEffect, useState } from 'react';
import { Users, Syringe, Database, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
            padding: '1rem',
            borderRadius: '50%',
            background: `${color}20`,
            color: color
        }}>
            <Icon size={24} />
        </div>
        <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{value}</h3>
        </div>
    </div >
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        injections: 0,
        peptides: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // In a real app, you might want a dedicated RPC function for this to avoid fetching all rows
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: injectionCount } = await supabase.from('injections').select('*', { count: 'exact', head: true });
            const { count: peptideCount } = await supabase.from('peptides').select('*', { count: 'exact', head: true });

            setStats({
                users: userCount || 0,
                injections: injectionCount || 0,
                peptides: peptideCount || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    title="Total Users"
                    value={loading ? '...' : stats.users}
                    icon={Users}
                    color="#3b82f6"
                />
                <StatCard
                    title="Total Injections"
                    value={loading ? '...' : stats.injections}
                    icon={Syringe}
                    color="#10b981"
                />
                <StatCard
                    title="Peptides in DB"
                    value={loading ? '...' : stats.peptides}
                    icon={Database}
                    color="#8b5cf6"
                />
                <StatCard
                    title="System Status"
                    value="Healthy"
                    icon={Activity}
                    color="#f59e0b"
                />
            </div>

            <div className="card glass-panel" style={{ padding: '2rem' }}>
                <h3>Recent Activity</h3>
                <p style={{ color: 'var(--text-secondary)' }}>No recent activity to show.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
