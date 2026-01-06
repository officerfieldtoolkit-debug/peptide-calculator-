import React, { useState, useEffect } from 'react';
import {
    Activity, Filter, Calendar, User, ChevronLeft, ChevronRight, RefreshCw,
    LogIn, LogOut, Plus, Trash2, Edit2, Star, Package, Syringe, Clock,
    Settings, Shield, Bell, Download, Eye, LayoutGrid, List, FileText,
    UserPlus, Key, Mail, MessageSquare, AlertTriangle, CheckCircle
} from 'lucide-react';
import { auditService } from '../services/auditService';
import styles from './AdminAuditLogs.module.css';

// Icon mapping for different actions
const ACTION_ICONS = {
    'login': LogIn,
    'logout': LogOut,
    'profile_updated': Settings,
    'profile_created': UserPlus,
    'injection_created': Plus,
    'injection_updated': Edit2,
    'injection_deleted': Trash2,
    'schedule_created': Calendar,
    'schedule_updated': Edit2,
    'schedule_deleted': Trash2,
    'schedule_completed': CheckCircle,
    'review_created': Star,
    'review_updated': Edit2,
    'review_deleted': Trash2,
    'inventory_created': Package,
    'inventory_updated': Edit2,
    'inventory_deleted': Trash2,
    'export_data': Download,
    'password_changed': Key,
    'email_changed': Mail,
    'settings_updated': Settings,
    'notification_sent': Bell,
    'ticket_created': MessageSquare,
    'ticket_updated': Edit2,
    'admin_action': Shield,
    'view': Eye,
    'error': AlertTriangle,
    'default': Activity
};

const AdminAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [stats, setStats] = useState(null);
    const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'table'
    const [expandedLog, setExpandedLog] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        action: '',
        entityType: '',
        startDate: '',
        endDate: ''
    });

    // Pagination
    const [page, setPage] = useState(0);
    const pageSize = 50;

    // Filter options
    const [actionTypes, setActionTypes] = useState([]);
    const [entityTypes, setEntityTypes] = useState([]);

    useEffect(() => {
        loadFilterOptions();
        loadStats();
    }, []);

    useEffect(() => {
        loadLogs();
    }, [page, filters]);

    const loadFilterOptions = async () => {
        try {
            const [actions, entities] = await Promise.all([
                auditService.getActionTypes(),
                auditService.getEntityTypes()
            ]);
            setActionTypes(actions);
            setEntityTypes(entities);
        } catch (err) {
            console.error('Failed to load filter options:', err);
        }
    };

    const loadStats = async () => {
        try {
            const data = await auditService.getStats(7);
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const loadLogs = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data, count } = await auditService.getAllLogs({
                limit: pageSize,
                offset: page * pageSize,
                action: filters.action || null,
                entityType: filters.entityType || null,
                startDate: filters.startDate || null,
                endDate: filters.endDate || null
            });
            setLogs(data || []);
            setTotalCount(count || 0);
        } catch (err) {
            setError('Failed to load audit logs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(0);
    };

    const clearFilters = () => {
        setFilters({ action: '', entityType: '', startDate: '', endDate: '' });
        setPage(0);
    };

    // Format relative time
    const formatRelativeTime = (date) => {
        const now = new Date();
        const then = new Date(date);
        const diffSeconds = Math.floor((now - then) / 1000);

        if (diffSeconds < 60) return 'Just now';
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min ago`;
        if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
        if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} days ago`;

        return then.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: then.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    // Format exact timestamp
    const formatExactTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Get human-readable activity description
    const getActivityDescription = (log) => {
        const userName = log.profiles?.full_name || log.profiles?.email?.split('@')[0] || 'Someone';
        const entityName = log.entity_type ? log.entity_type.replace(/_/g, ' ') : '';

        const descriptions = {
            'login': () => `${userName} signed in`,
            'logout': () => `${userName} signed out`,
            'profile_updated': () => `${userName} updated their profile`,
            'profile_created': () => `${userName} created an account`,
            'injection_created': () => `${userName} logged a new injection${getInjectionDetails(log)}`,
            'injection_updated': () => `${userName} updated an injection record`,
            'injection_deleted': () => `${userName} deleted an injection record`,
            'schedule_created': () => `${userName} created a new schedule${getScheduleDetails(log)}`,
            'schedule_updated': () => `${userName} updated a schedule`,
            'schedule_deleted': () => `${userName} deleted a schedule`,
            'schedule_completed': () => `${userName} marked a dose as complete`,
            'review_created': () => `${userName} wrote a review${getReviewDetails(log)}`,
            'review_updated': () => `${userName} edited a review`,
            'review_deleted': () => `${userName} deleted a review`,
            'inventory_created': () => `${userName} added to inventory${getInventoryDetails(log)}`,
            'inventory_updated': () => `${userName} updated inventory`,
            'inventory_deleted': () => `${userName} removed from inventory`,
            'export_data': () => `${userName} exported their data`,
            'password_changed': () => `${userName} changed their password`,
            'email_changed': () => `${userName} changed their email`,
            'settings_updated': () => `${userName} updated settings`,
            'notification_sent': () => `Notification sent to ${userName}`,
            'ticket_created': () => `${userName} opened a support ticket`,
            'ticket_updated': () => `Support ticket updated`,
            'admin_action': () => `Admin action by ${userName}`,
            'view': () => `${userName} viewed ${entityName}`
        };

        return descriptions[log.action]?.() || `${userName} performed ${log.action.replace(/_/g, ' ')} on ${entityName}`;
    };

    // Extract details from log metadata/new_values
    const getInjectionDetails = (log) => {
        const data = log.new_values || log.metadata;
        if (!data) return '';
        if (data.peptide_name) return ` of ${data.peptide_name}`;
        return '';
    };

    const getScheduleDetails = (log) => {
        const data = log.new_values || log.metadata;
        if (!data) return '';
        if (data.peptide_name) return ` for ${data.peptide_name}`;
        return '';
    };

    const getReviewDetails = (log) => {
        const data = log.new_values || log.metadata;
        if (!data) return '';
        if (data.peptide_name) return ` for ${data.peptide_name}`;
        if (data.rating) return ` (${data.rating}★)`;
        return '';
    };

    const getInventoryDetails = (log) => {
        const data = log.new_values || log.metadata;
        if (!data) return '';
        if (data.peptide_name) return `: ${data.peptide_name}`;
        return '';
    };

    // Format the changes for display
    const formatChanges = (log) => {
        if (!log.new_values && !log.old_values && !log.metadata) return null;

        const changes = [];
        const newVals = log.new_values || {};
        const oldVals = log.old_values || {};
        const metadata = log.metadata || {};

        // Combine all data
        const allData = { ...metadata, ...newVals };

        // Skip internal/technical fields
        const skipFields = ['id', 'user_id', 'created_at', 'updated_at', 'profile_id'];

        Object.entries(allData).forEach(([key, value]) => {
            if (skipFields.includes(key)) return;
            if (value === null || value === undefined) return;

            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const oldVal = oldVals[key];

            if (oldVal !== undefined && oldVal !== value) {
                changes.push({
                    type: 'changed',
                    label,
                    oldValue: formatValue(oldVal),
                    newValue: formatValue(value)
                });
            } else if (!oldVals[key]) {
                changes.push({
                    type: 'set',
                    label,
                    value: formatValue(value)
                });
            }
        });

        return changes.length > 0 ? changes : null;
    };

    const formatValue = (value) => {
        if (value === null || value === undefined) return 'None';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'object') return JSON.stringify(value);
        if (typeof value === 'number') return value.toLocaleString();
        return String(value);
    };

    // Get the icon component for an action
    const getActionIcon = (action) => {
        const Icon = ACTION_ICONS[action] || ACTION_ICONS.default;
        return Icon;
    };

    // Get action category for grouping
    const getActionCategory = (action) => {
        if (action.includes('login') || action.includes('logout') || action.includes('password') || action.includes('email')) {
            return 'auth';
        }
        if (action.includes('injection')) return 'injection';
        if (action.includes('schedule')) return 'schedule';
        if (action.includes('review')) return 'review';
        if (action.includes('inventory')) return 'inventory';
        if (action.includes('profile') || action.includes('settings')) return 'profile';
        if (action.includes('admin') || action.includes('ticket')) return 'admin';
        return 'other';
    };

    const categoryColors = {
        auth: '#8b5cf6',      // Purple
        injection: '#10b981', // Green
        schedule: '#3b82f6',  // Blue
        review: '#f59e0b',    // Amber
        inventory: '#06b6d4', // Cyan
        profile: '#ec4899',   // Pink
        admin: '#ef4444',     // Red
        other: '#6b7280'      // Gray
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>
                    <Activity size={28} />
                    Activity Log
                </h1>
                <div className={styles.headerActions}>
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.viewBtn} ${viewMode === 'timeline' ? styles.active : ''}`}
                            onClick={() => setViewMode('timeline')}
                            title="Timeline View"
                        >
                            <List size={18} />
                        </button>
                        <button
                            className={`${styles.viewBtn} ${viewMode === 'table' ? styles.active : ''}`}
                            onClick={() => setViewMode('table')}
                            title="Table View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                    <button className={styles.refreshBtn} onClick={() => { loadLogs(); loadStats(); }}>
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{stats.total}</span>
                        <span className={styles.statLabel}>Events (7 days)</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{Object.keys(stats.byAction).length}</span>
                        <span className={styles.statLabel}>Action Types</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{Object.keys(stats.byDay).length}</span>
                        <span className={styles.statLabel}>Active Days</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>
                            {Math.round(stats.total / Math.max(Object.keys(stats.byDay).length, 1))}
                        </span>
                        <span className={styles.statLabel}>Avg/Day</span>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.filterIcon}>
                    <Filter size={18} />
                    Filters:
                </div>

                <select
                    value={filters.action}
                    onChange={(e) => handleFilterChange('action', e.target.value)}
                >
                    <option value="">All Actions</option>
                    {actionTypes.map(action => (
                        <option key={action} value={action}>
                            {auditService.formatAction(action)}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.entityType}
                    onChange={(e) => handleFilterChange('entityType', e.target.value)}
                >
                    <option value="">All Entities</option>
                    {entityTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                <div className={styles.dateFilter}>
                    <Calendar size={16} />
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        placeholder="Start date"
                    />
                    <span>to</span>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        placeholder="End date"
                    />
                </div>

                {(filters.action || filters.entityType || filters.startDate || filters.endDate) && (
                    <button className={styles.clearBtn} onClick={clearFilters}>
                        Clear
                    </button>
                )}
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {/* Timeline View */}
            {viewMode === 'timeline' && (
                <div className={styles.timeline}>
                    {loading ? (
                        <div className={styles.loading}>
                            <RefreshCw size={24} className={styles.spinner} />
                            Loading activity...
                        </div>
                    ) : logs.length === 0 ? (
                        <div className={styles.empty}>
                            <Activity size={48} />
                            <p>No activity found</p>
                        </div>
                    ) : (
                        logs.map(log => {
                            const Icon = getActionIcon(log.action);
                            const category = getActionCategory(log.action);
                            const color = categoryColors[category];
                            const changes = formatChanges(log);
                            const isExpanded = expandedLog === log.id;

                            return (
                                <div
                                    key={log.id}
                                    className={`${styles.timelineItem} ${isExpanded ? styles.expanded : ''}`}
                                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                                >
                                    <div
                                        className={styles.timelineIcon}
                                        style={{ backgroundColor: `${color}20`, color }}
                                    >
                                        <Icon size={18} />
                                    </div>

                                    <div className={styles.timelineContent}>
                                        <div className={styles.timelineHeader}>
                                            <p className={styles.timelineDescription}>
                                                {getActivityDescription(log)}
                                            </p>
                                            <span className={styles.timelineTime} title={formatExactTime(log.created_at)}>
                                                <Clock size={12} />
                                                {formatRelativeTime(log.created_at)}
                                            </span>
                                        </div>

                                        {log.entity_type && (
                                            <div className={styles.timelineMeta}>
                                                <span
                                                    className={styles.categoryBadge}
                                                    style={{ backgroundColor: `${color}15`, color, borderColor: `${color}30` }}
                                                >
                                                    {log.entity_type}
                                                </span>
                                                {log.entity_id && (
                                                    <span className={styles.entityId}>
                                                        ID: {log.entity_id.substring(0, 8)}...
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Expandable details */}
                                        {isExpanded && changes && (
                                            <div className={styles.changeDetails}>
                                                <h4>Changes</h4>
                                                <div className={styles.changeList}>
                                                    {changes.map((change, idx) => (
                                                        <div key={idx} className={styles.changeItem}>
                                                            <span className={styles.changeLabel}>{change.label}</span>
                                                            {change.type === 'changed' ? (
                                                                <div className={styles.changeValues}>
                                                                    <span className={styles.oldValue}>{change.oldValue}</span>
                                                                    <span className={styles.arrow}>→</span>
                                                                    <span className={styles.newValue}>{change.newValue}</span>
                                                                </div>
                                                            ) : (
                                                                <span className={styles.setValue}>{change.value}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={styles.exactTime}>
                                                    <Clock size={12} />
                                                    {formatExactTime(log.created_at)}
                                                </div>
                                            </div>
                                        )}

                                        {isExpanded && !changes && (log.new_values || log.metadata) && (
                                            <div className={styles.changeDetails}>
                                                <h4>Raw Data</h4>
                                                <pre className={styles.rawData}>
                                                    {JSON.stringify(log.new_values || log.metadata, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>User</th>
                                <th>Activity</th>
                                <th>Category</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className={styles.loading}>Loading...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className={styles.empty}>No logs found</td>
                                </tr>
                            ) : (
                                logs.map(log => {
                                    const category = getActionCategory(log.action);
                                    const color = categoryColors[category];
                                    return (
                                        <tr key={log.id}>
                                            <td className={styles.timestamp} title={formatExactTime(log.created_at)}>
                                                {formatRelativeTime(log.created_at)}
                                            </td>
                                            <td className={styles.user}>
                                                <User size={14} />
                                                {log.profiles?.full_name || log.profiles?.email?.split('@')[0] || 'System'}
                                            </td>
                                            <td className={styles.activity}>
                                                {getActivityDescription(log)}
                                            </td>
                                            <td>
                                                <span
                                                    className={styles.categoryBadge}
                                                    style={{ backgroundColor: `${color}15`, color, borderColor: `${color}30` }}
                                                >
                                                    {log.entity_type || category}
                                                </span>
                                            </td>
                                            <td className={styles.details}>
                                                {(log.new_values || log.metadata) && (
                                                    <details>
                                                        <summary>View</summary>
                                                        <pre>{JSON.stringify(log.new_values || log.metadata, null, 2)}</pre>
                                                    </details>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalCount > pageSize && (
                <div className={styles.pagination}>
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </button>
                    <span>
                        Page {page + 1} of {totalPages} ({totalCount} total)
                    </span>
                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminAuditLogs;
