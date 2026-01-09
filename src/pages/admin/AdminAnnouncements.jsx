import React, { useState, useEffect } from 'react';
import {
    Megaphone, Plus, Trash2, Edit2, Save, X, Eye, EyeOff,
    RefreshCw, Calendar, AlertTriangle, Info, CheckCircle, Bell
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './AdminAnnouncements.module.css';

const AdminAnnouncements = () => {
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        message: '',
        type: 'info',
        target: 'all',
        is_active: true,
        is_dismissible: true,
        starts_at: new Date().toISOString().slice(0, 16),
        ends_at: ''
    });

    // Default announcements
    const defaultAnnouncements = [
        {
            id: 1,
            title: 'Welcome to PeptideLog!',
            message: 'Track your peptide protocols safely and efficiently.',
            type: 'info',
            target: 'all',
            is_active: true,
            is_dismissible: true,
            starts_at: new Date().toISOString(),
            ends_at: null,
            created_at: new Date().toISOString()
        }
    ];

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data?.length) {
                const stored = localStorage.getItem('admin_announcements');
                if (stored) {
                    setAnnouncements(JSON.parse(stored));
                } else {
                    setAnnouncements(defaultAnnouncements);
                    localStorage.setItem('admin_announcements', JSON.stringify(defaultAnnouncements));
                }
            } else {
                setAnnouncements(data);
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
            setAnnouncements(defaultAnnouncements);
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = (id) => {
        const updated = announcements.map(a =>
            a.id === id ? { ...a, is_active: !a.is_active } : a
        );
        setAnnouncements(updated);
        localStorage.setItem('admin_announcements', JSON.stringify(updated));
    };

    const handleAdd = () => {
        const id = Math.max(...announcements.map(a => a.id), 0) + 1;
        const announcement = {
            ...newAnnouncement,
            id,
            created_at: new Date().toISOString(),
            ends_at: newAnnouncement.ends_at || null
        };
        const updated = [announcement, ...announcements];
        setAnnouncements(updated);
        localStorage.setItem('admin_announcements', JSON.stringify(updated));
        setShowAddModal(false);
        resetForm();
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this announcement?')) {
            const updated = announcements.filter(a => a.id !== id);
            setAnnouncements(updated);
            localStorage.setItem('admin_announcements', JSON.stringify(updated));
        }
    };

    const resetForm = () => {
        setNewAnnouncement({
            title: '',
            message: '',
            type: 'info',
            target: 'all',
            is_active: true,
            is_dismissible: true,
            starts_at: new Date().toISOString().slice(0, 16),
            ends_at: ''
        });
        setEditingAnnouncement(null);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle size={16} />;
            case 'success': return <CheckCircle size={16} />;
            case 'error': return <AlertTriangle size={16} />;
            default: return <Info size={16} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'warning': return '#f59e0b';
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            default: return '#3b82f6';
        }
    };

    const formatDate = (date) => {
        if (!date) return 'No end date';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <RefreshCw className={styles.spinner} size={32} />
                <p>Loading announcements...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>System Announcements</h1>
                    <p>Create banners and notifications for all users</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className={styles.addBtn}>
                    <Plus size={18} />
                    New Announcement
                </button>
            </div>

            {/* Preview */}
            {announcements.filter(a => a.is_active).length > 0 && (
                <div className={styles.previewSection}>
                    <h3><Eye size={16} /> Live Preview</h3>
                    {announcements.filter(a => a.is_active).slice(0, 1).map(a => (
                        <div
                            key={a.id}
                            className={styles.previewBanner}
                            style={{
                                background: `${getTypeColor(a.type)}15`,
                                borderColor: `${getTypeColor(a.type)}40`
                            }}
                        >
                            <span style={{ color: getTypeColor(a.type) }}>{getTypeIcon(a.type)}</span>
                            <div>
                                <strong>{a.title}</strong>
                                <p>{a.message}</p>
                            </div>
                            {a.is_dismissible && <X size={16} style={{ opacity: 0.5 }} />}
                        </div>
                    ))}
                </div>
            )}

            {/* Announcements List */}
            <div className={styles.list}>
                {announcements.map(announcement => (
                    <div
                        key={announcement.id}
                        className={`${styles.card} ${announcement.is_active ? styles.active : styles.inactive}`}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>
                                <span
                                    className={styles.typeBadge}
                                    style={{
                                        background: `${getTypeColor(announcement.type)}20`,
                                        color: getTypeColor(announcement.type)
                                    }}
                                >
                                    {getTypeIcon(announcement.type)}
                                    {announcement.type}
                                </span>
                                <h3>{announcement.title}</h3>
                            </div>
                            <div className={styles.cardActions}>
                                <button
                                    onClick={() => toggleActive(announcement.id)}
                                    className={announcement.is_active ? styles.activeBtn : styles.inactiveBtn}
                                >
                                    {announcement.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                    {announcement.is_active ? 'Active' : 'Inactive'}
                                </button>
                                <button
                                    onClick={() => handleDelete(announcement.id)}
                                    className={styles.deleteBtn}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p className={styles.message}>{announcement.message}</p>
                        <div className={styles.cardMeta}>
                            <span><Calendar size={14} /> {formatDate(announcement.starts_at)}</span>
                            <span>→</span>
                            <span>{announcement.ends_at ? formatDate(announcement.ends_at) : 'No end date'}</span>
                            <span className={styles.target}>Target: {announcement.target}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2><Megaphone size={20} /> New Announcement</h2>
                            <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.field}>
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    placeholder="Announcement title"
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Message</label>
                                <textarea
                                    value={newAnnouncement.message}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                                    placeholder="Announcement message"
                                    rows={3}
                                />
                            </div>
                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label>Type</label>
                                    <select
                                        value={newAnnouncement.type}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                    >
                                        <option value="info">Info</option>
                                        <option value="success">Success</option>
                                        <option value="warning">Warning</option>
                                        <option value="error">Error</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label>Target Audience</label>
                                    <select
                                        value={newAnnouncement.target}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, target: e.target.value })}
                                    >
                                        <option value="all">All Users</option>
                                        <option value="free">Free Users</option>
                                        <option value="premium">Premium Users</option>
                                        <option value="new">New Users</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label>Start Date</label>
                                    <input
                                        type="datetime-local"
                                        value={newAnnouncement.starts_at}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, starts_at: e.target.value })}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>End Date (optional)</label>
                                    <input
                                        type="datetime-local"
                                        value={newAnnouncement.ends_at}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, ends_at: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className={styles.checkboxRow}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newAnnouncement.is_dismissible}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, is_dismissible: e.target.checked })}
                                    />
                                    Allow users to dismiss
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newAnnouncement.is_active}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, is_active: e.target.checked })}
                                    />
                                    Active immediately
                                </label>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowAddModal(false)} className={styles.cancelBtn}>Cancel</button>
                            <button onClick={handleAdd} className={styles.saveBtn}>
                                <Bell size={16} />
                                Publish Announcement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncements;
