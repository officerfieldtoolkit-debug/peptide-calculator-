import React, { useState } from 'react';
import {
    Download, FileSpreadsheet, Users, Database, Calendar,
    DollarSign, RefreshCw, Check, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './AdminExport.module.css';

const AdminExport = () => {
    const [exporting, setExporting] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const exportOptions = [
        {
            id: 'users',
            name: 'Users',
            description: 'Export all user profiles and account data',
            icon: Users,
            color: '#3b82f6',
            table: 'profiles',
            fields: ['id', 'email', 'full_name', 'created_at', 'is_admin', 'subscription_tier']
        },
        {
            id: 'injections',
            name: 'Injection Logs',
            description: 'Export all injection records',
            icon: Database,
            color: '#10b981',
            table: 'injections',
            fields: ['id', 'user_id', 'peptide_id', 'dose', 'dose_unit', 'scheduled_date', 'completed', 'created_at']
        },
        {
            id: 'subscriptions',
            name: 'Subscriptions',
            description: 'Export subscription and payment data',
            icon: DollarSign,
            color: '#f59e0b',
            table: 'user_subscriptions',
            fields: ['id', 'user_id', 'plan', 'status', 'current_period_start', 'current_period_end', 'created_at']
        },
        {
            id: 'reviews',
            name: 'Reviews',
            description: 'Export all vendor reviews',
            icon: FileSpreadsheet,
            color: '#8b5cf6',
            table: 'reviews',
            fields: ['id', 'user_id', 'vendor_id', 'rating', 'title', 'content', 'created_at']
        },
        {
            id: 'audit_logs',
            name: 'Audit Logs',
            description: 'Export admin activity logs',
            icon: Calendar,
            color: '#ec4899',
            table: 'audit_logs',
            fields: ['id', 'user_id', 'action', 'entity_type', 'entity_id', 'created_at']
        }
    ];

    const handleExport = async (option) => {
        setExporting(option.id);
        setError(null);
        setSuccess(null);

        try {
            // Fetch data from Supabase
            const { data, error: fetchError } = await supabase
                .from(option.table)
                .select(option.fields.join(','))
                .limit(10000);

            if (fetchError) throw fetchError;

            if (!data || data.length === 0) {
                setError(`No data found in ${option.name}`);
                setExporting(null);
                return;
            }

            // Convert to CSV
            const csv = convertToCSV(data, option.fields);

            // Download file
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${option.id}_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setSuccess(option.id);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Export error:', err);
            setError(`Failed to export ${option.name}: ${err.message}`);
        } finally {
            setExporting(null);
        }
    };

    const convertToCSV = (data, fields) => {
        const header = fields.join(',');
        const rows = data.map(row => {
            return fields.map(field => {
                const value = row[field];
                if (value === null || value === undefined) return '';
                if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });
        return [header, ...rows].join('\n');
    };

    const handleExportAll = async () => {
        for (const option of exportOptions) {
            await handleExport(option);
            await new Promise(r => setTimeout(r, 500)); // Small delay between exports
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Export Data</h1>
                    <p>Download your data as CSV files</p>
                </div>
                <button onClick={handleExportAll} className={styles.exportAllBtn}>
                    <Download size={18} />
                    Export All
                </button>
            </div>

            {error && (
                <div className={styles.errorBanner}>
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className={styles.grid}>
                {exportOptions.map(option => (
                    <div key={option.id} className={styles.card}>
                        <div
                            className={styles.cardIcon}
                            style={{ background: `${option.color}15`, color: option.color }}
                        >
                            <option.icon size={24} />
                        </div>
                        <div className={styles.cardContent}>
                            <h3>{option.name}</h3>
                            <p>{option.description}</p>
                            <div className={styles.fields}>
                                {option.fields.slice(0, 4).map(field => (
                                    <span key={field}>{field}</span>
                                ))}
                                {option.fields.length > 4 && (
                                    <span>+{option.fields.length - 4} more</span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleExport(option)}
                            disabled={exporting === option.id}
                            className={`${styles.exportBtn} ${success === option.id ? styles.success : ''}`}
                        >
                            {exporting === option.id ? (
                                <RefreshCw size={18} className={styles.spinner} />
                            ) : success === option.id ? (
                                <Check size={18} />
                            ) : (
                                <Download size={18} />
                            )}
                            {exporting === option.id ? 'Exporting...' : success === option.id ? 'Downloaded' : 'Export CSV'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Info Section */}
            <div className={styles.infoSection}>
                <h3>📊 Export Information</h3>
                <ul>
                    <li>All exports are in CSV format, compatible with Excel and Google Sheets</li>
                    <li>Exports include up to 10,000 rows per table</li>
                    <li>Sensitive data like passwords are never exported</li>
                    <li>Timestamps are in ISO 8601 format</li>
                    <li>For larger exports, contact support for a database backup</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminExport;
