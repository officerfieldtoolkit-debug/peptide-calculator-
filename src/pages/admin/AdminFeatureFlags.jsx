import React, { useState, useEffect } from 'react';
import {
    ToggleLeft, ToggleRight, Plus, Trash2, Edit2, Save, X,
    RefreshCw, AlertCircle, CheckCircle, Users, Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './AdminFeatureFlags.module.css';

const AdminFeatureFlags = () => {
    const [loading, setLoading] = useState(true);
    const [flags, setFlags] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingFlag, setEditingFlag] = useState(null);
    const [newFlag, setNewFlag] = useState({
        name: '',
        key: '',
        description: '',
        enabled: false,
        rollout_percentage: 100,
        user_targeting: 'all'
    });

    // Default feature flags if none exist
    const defaultFlags = [
        { id: 1, name: 'Dark Mode', key: 'dark_mode', description: 'Enable dark mode theme', enabled: true, rollout_percentage: 100, user_targeting: 'all' },
        { id: 2, name: 'New Calculator UI', key: 'new_calculator_ui', description: 'Enable redesigned calculator interface', enabled: false, rollout_percentage: 50, user_targeting: 'premium' },
        { id: 3, name: 'AI Recommendations', key: 'ai_recommendations', description: 'Enable AI-powered peptide recommendations', enabled: false, rollout_percentage: 10, user_targeting: 'all' },
        { id: 4, name: 'Beta Features', key: 'beta_features', description: 'Enable all beta features', enabled: false, rollout_percentage: 100, user_targeting: 'admin' },
        { id: 5, name: 'Price Alerts', key: 'price_alerts', description: 'Enable price drop notifications', enabled: true, rollout_percentage: 100, user_targeting: 'premium' },
        { id: 6, name: 'Social Sharing', key: 'social_sharing', description: 'Enable social sharing features', enabled: true, rollout_percentage: 100, user_targeting: 'all' },
        { id: 7, name: 'PWA Install Prompt', key: 'pwa_install', description: 'Show PWA install prompt', enabled: true, rollout_percentage: 100, user_targeting: 'all' },
        { id: 8, name: 'Maintenance Mode', key: 'maintenance_mode', description: 'Put site in maintenance mode', enabled: false, rollout_percentage: 100, user_targeting: 'all' }
    ];

    useEffect(() => {
        loadFlags();
    }, []);

    const loadFlags = async () => {
        setLoading(true);
        try {
            // Try to load from database, fallback to defaults
            const { data, error } = await supabase
                .from('feature_flags')
                .select('*')
                .order('created_at', { ascending: true });

            if (error || !data?.length) {
                // Use localStorage as fallback
                const stored = localStorage.getItem('admin_feature_flags');
                if (stored) {
                    setFlags(JSON.parse(stored));
                } else {
                    setFlags(defaultFlags);
                    localStorage.setItem('admin_feature_flags', JSON.stringify(defaultFlags));
                }
            } else {
                setFlags(data);
            }
        } catch (error) {
            console.error('Error loading flags:', error);
            setFlags(defaultFlags);
        } finally {
            setLoading(false);
        }
    };

    const toggleFlag = async (flagId) => {
        const updatedFlags = flags.map(f =>
            f.id === flagId ? { ...f, enabled: !f.enabled } : f
        );
        setFlags(updatedFlags);
        localStorage.setItem('admin_feature_flags', JSON.stringify(updatedFlags));

        // Try to update in database
        try {
            const flag = updatedFlags.find(f => f.id === flagId);
            await supabase.from('feature_flags').upsert({
                id: flagId,
                enabled: flag.enabled,
                updated_at: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating flag:', error);
        }
    };

    const handleAddFlag = () => {
        const id = Math.max(...flags.map(f => f.id), 0) + 1;
        const flag = { ...newFlag, id, created_at: new Date().toISOString() };
        const updatedFlags = [...flags, flag];
        setFlags(updatedFlags);
        localStorage.setItem('admin_feature_flags', JSON.stringify(updatedFlags));
        setShowAddModal(false);
        setNewFlag({
            name: '',
            key: '',
            description: '',
            enabled: false,
            rollout_percentage: 100,
            user_targeting: 'all'
        });
    };

    const handleDeleteFlag = (flagId) => {
        if (window.confirm('Are you sure you want to delete this feature flag?')) {
            const updatedFlags = flags.filter(f => f.id !== flagId);
            setFlags(updatedFlags);
            localStorage.setItem('admin_feature_flags', JSON.stringify(updatedFlags));
        }
    };

    const handleUpdateRollout = (flagId, percentage) => {
        const updatedFlags = flags.map(f =>
            f.id === flagId ? { ...f, rollout_percentage: parseInt(percentage) } : f
        );
        setFlags(updatedFlags);
        localStorage.setItem('admin_feature_flags', JSON.stringify(updatedFlags));
    };

    const getTargetingLabel = (targeting) => {
        switch (targeting) {
            case 'all': return 'All Users';
            case 'premium': return 'Premium Only';
            case 'admin': return 'Admins Only';
            case 'beta': return 'Beta Testers';
            default: return targeting;
        }
    };

    const getTargetingColor = (targeting) => {
        switch (targeting) {
            case 'all': return '#10b981';
            case 'premium': return '#f59e0b';
            case 'admin': return '#ef4444';
            case 'beta': return '#8b5cf6';
            default: return '#64748b';
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <RefreshCw className={styles.spinner} size={32} />
                <p>Loading feature flags...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Feature Flags</h1>
                    <p>Toggle features on/off without deploying code</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className={styles.addBtn}>
                    <Plus size={18} />
                    Add Flag
                </button>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
                <div className={styles.stat}>
                    <Zap size={20} color="#10b981" />
                    <span>{flags.filter(f => f.enabled).length}</span>
                    <label>Enabled</label>
                </div>
                <div className={styles.stat}>
                    <AlertCircle size={20} color="#64748b" />
                    <span>{flags.filter(f => !f.enabled).length}</span>
                    <label>Disabled</label>
                </div>
                <div className={styles.stat}>
                    <Users size={20} color="#f59e0b" />
                    <span>{flags.filter(f => f.user_targeting === 'premium').length}</span>
                    <label>Premium Only</label>
                </div>
            </div>

            {/* Flags List */}
            <div className={styles.flagsList}>
                {flags.map(flag => (
                    <div key={flag.id} className={`${styles.flagCard} ${flag.enabled ? styles.enabled : ''}`}>
                        <div className={styles.flagMain}>
                            <button
                                className={styles.toggle}
                                onClick={() => toggleFlag(flag.id)}
                            >
                                {flag.enabled ? (
                                    <ToggleRight size={32} color="#10b981" />
                                ) : (
                                    <ToggleLeft size={32} color="#64748b" />
                                )}
                            </button>
                            <div className={styles.flagInfo}>
                                <div className={styles.flagHeader}>
                                    <span className={styles.flagName}>{flag.name}</span>
                                    <code className={styles.flagKey}>{flag.key}</code>
                                </div>
                                <p className={styles.flagDesc}>{flag.description}</p>
                            </div>
                        </div>

                        <div className={styles.flagMeta}>
                            <div className={styles.rollout}>
                                <label>Rollout</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={flag.rollout_percentage}
                                    onChange={(e) => handleUpdateRollout(flag.id, e.target.value)}
                                    className={styles.slider}
                                />
                                <span>{flag.rollout_percentage}%</span>
                            </div>
                            <span
                                className={styles.targeting}
                                style={{ background: `${getTargetingColor(flag.user_targeting)}20`, color: getTargetingColor(flag.user_targeting) }}
                            >
                                {getTargetingLabel(flag.user_targeting)}
                            </span>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteFlag(flag.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Add Feature Flag</h2>
                            <button onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.field}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={newFlag.name}
                                    onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                                    placeholder="e.g. New Dashboard"
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Key</label>
                                <input
                                    type="text"
                                    value={newFlag.key}
                                    onChange={(e) => setNewFlag({ ...newFlag, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                    placeholder="e.g. new_dashboard"
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Description</label>
                                <textarea
                                    value={newFlag.description}
                                    onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                                    placeholder="What does this flag control?"
                                />
                            </div>
                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label>User Targeting</label>
                                    <select
                                        value={newFlag.user_targeting}
                                        onChange={(e) => setNewFlag({ ...newFlag, user_targeting: e.target.value })}
                                    >
                                        <option value="all">All Users</option>
                                        <option value="premium">Premium Only</option>
                                        <option value="admin">Admins Only</option>
                                        <option value="beta">Beta Testers</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label>Rollout %</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={newFlag.rollout_percentage}
                                        onChange={(e) => setNewFlag({ ...newFlag, rollout_percentage: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowAddModal(false)} className={styles.cancelBtn}>
                                Cancel
                            </button>
                            <button onClick={handleAddFlag} className={styles.saveBtn}>
                                <Save size={16} />
                                Create Flag
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFeatureFlags;
