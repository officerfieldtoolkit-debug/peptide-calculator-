import React, { useState, useEffect } from 'react';
import {
    Settings, Save, RefreshCw, Globe, Bell, Shield, Mail,
    Database, Server, ToggleLeft, ToggleRight, AlertTriangle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './AdminSettings.module.css';

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        // General
        site_name: 'PeptideLog',
        site_description: 'Track your peptide protocols safely',
        support_email: 'support@peptidelog.net',

        // Features
        maintenance_mode: false,
        registration_enabled: true,
        email_verification_required: true,

        // Limits
        max_peptides_free: 5,
        max_injections_free: 50,
        max_file_upload_mb: 10,

        // Security
        session_timeout_minutes: 60,
        max_login_attempts: 5,
        lockout_duration_minutes: 15,

        // Notifications
        send_welcome_email: true,
        send_injection_reminders: true,
        send_price_alerts: true,

        // API
        rate_limit_requests: 100,
        rate_limit_window_minutes: 15
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            // Try to load from database
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single();

            if (data && !error) {
                setSettings({ ...settings, ...data.settings });
            } else {
                // Use localStorage fallback
                const stored = localStorage.getItem('admin_settings');
                if (stored) {
                    setSettings(JSON.parse(stored));
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save to localStorage
            localStorage.setItem('admin_settings', JSON.stringify(settings));

            // Try to save to database
            await supabase.from('site_settings').upsert({
                id: 1,
                settings,
                updated_at: new Date().toISOString()
            });

            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Settings saved locally (database sync failed)');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const ToggleSwitch = ({ value, onChange }) => (
        <button
            className={`${styles.toggle} ${value ? styles.on : styles.off}`}
            onClick={() => onChange(!value)}
        >
            {value ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
        </button>
    );

    if (loading) {
        return (
            <div className={styles.loading}>
                <RefreshCw className={styles.spinner} size={32} />
                <p>Loading settings...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Site Settings</h1>
                    <p>Configure global application settings</p>
                </div>
                <button onClick={handleSave} className={styles.saveBtn} disabled={saving}>
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {settings.maintenance_mode && (
                <div className={styles.warningBanner}>
                    <AlertTriangle size={20} />
                    <span>Maintenance mode is ON - site is not accessible to regular users</span>
                </div>
            )}

            {/* General Settings */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Globe size={20} />
                    <h2>General</h2>
                </div>
                <div className={styles.fields}>
                    <div className={styles.field}>
                        <label>Site Name</label>
                        <input
                            type="text"
                            value={settings.site_name}
                            onChange={(e) => updateSetting('site_name', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Site Description</label>
                        <input
                            type="text"
                            value={settings.site_description}
                            onChange={(e) => updateSetting('site_description', e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Support Email</label>
                        <input
                            type="email"
                            value={settings.support_email}
                            onChange={(e) => updateSetting('support_email', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Feature Toggles */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Server size={20} />
                    <h2>Features</h2>
                </div>
                <div className={styles.toggles}>
                    <div className={styles.toggleRow}>
                        <div>
                            <span className={styles.toggleLabel}>Maintenance Mode</span>
                            <span className={styles.toggleDesc}>Disables site access for non-admin users</span>
                        </div>
                        <ToggleSwitch
                            value={settings.maintenance_mode}
                            onChange={(v) => updateSetting('maintenance_mode', v)}
                        />
                    </div>
                    <div className={styles.toggleRow}>
                        <div>
                            <span className={styles.toggleLabel}>User Registration</span>
                            <span className={styles.toggleDesc}>Allow new users to sign up</span>
                        </div>
                        <ToggleSwitch
                            value={settings.registration_enabled}
                            onChange={(v) => updateSetting('registration_enabled', v)}
                        />
                    </div>
                    <div className={styles.toggleRow}>
                        <div>
                            <span className={styles.toggleLabel}>Email Verification Required</span>
                            <span className={styles.toggleDesc}>Require users to verify email before access</span>
                        </div>
                        <ToggleSwitch
                            value={settings.email_verification_required}
                            onChange={(v) => updateSetting('email_verification_required', v)}
                        />
                    </div>
                </div>
            </div>

            {/* Limits */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Database size={20} />
                    <h2>Free Tier Limits</h2>
                </div>
                <div className={styles.fieldsGrid}>
                    <div className={styles.field}>
                        <label>Max Peptides</label>
                        <input
                            type="number"
                            value={settings.max_peptides_free}
                            onChange={(e) => updateSetting('max_peptides_free', parseInt(e.target.value))}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Max Injections</label>
                        <input
                            type="number"
                            value={settings.max_injections_free}
                            onChange={(e) => updateSetting('max_injections_free', parseInt(e.target.value))}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Max File Upload (MB)</label>
                        <input
                            type="number"
                            value={settings.max_file_upload_mb}
                            onChange={(e) => updateSetting('max_file_upload_mb', parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Shield size={20} />
                    <h2>Security</h2>
                </div>
                <div className={styles.fieldsGrid}>
                    <div className={styles.field}>
                        <label>Session Timeout (minutes)</label>
                        <input
                            type="number"
                            value={settings.session_timeout_minutes}
                            onChange={(e) => updateSetting('session_timeout_minutes', parseInt(e.target.value))}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Max Login Attempts</label>
                        <input
                            type="number"
                            value={settings.max_login_attempts}
                            onChange={(e) => updateSetting('max_login_attempts', parseInt(e.target.value))}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Lockout Duration (minutes)</label>
                        <input
                            type="number"
                            value={settings.lockout_duration_minutes}
                            onChange={(e) => updateSetting('lockout_duration_minutes', parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Bell size={20} />
                    <h2>Notifications</h2>
                </div>
                <div className={styles.toggles}>
                    <div className={styles.toggleRow}>
                        <div>
                            <span className={styles.toggleLabel}>Welcome Email</span>
                            <span className={styles.toggleDesc}>Send welcome email to new users</span>
                        </div>
                        <ToggleSwitch
                            value={settings.send_welcome_email}
                            onChange={(v) => updateSetting('send_welcome_email', v)}
                        />
                    </div>
                    <div className={styles.toggleRow}>
                        <div>
                            <span className={styles.toggleLabel}>Injection Reminders</span>
                            <span className={styles.toggleDesc}>Send scheduled injection reminders</span>
                        </div>
                        <ToggleSwitch
                            value={settings.send_injection_reminders}
                            onChange={(v) => updateSetting('send_injection_reminders', v)}
                        />
                    </div>
                    <div className={styles.toggleRow}>
                        <div>
                            <span className={styles.toggleLabel}>Price Alerts</span>
                            <span className={styles.toggleDesc}>Notify users of price drops</span>
                        </div>
                        <ToggleSwitch
                            value={settings.send_price_alerts}
                            onChange={(v) => updateSetting('send_price_alerts', v)}
                        />
                    </div>
                </div>
            </div>

            {/* API Rate Limiting */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Server size={20} />
                    <h2>API Rate Limiting</h2>
                </div>
                <div className={styles.fieldsGrid}>
                    <div className={styles.field}>
                        <label>Max Requests</label>
                        <input
                            type="number"
                            value={settings.rate_limit_requests}
                            onChange={(e) => updateSetting('rate_limit_requests', parseInt(e.target.value))}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Window (minutes)</label>
                        <input
                            type="number"
                            value={settings.rate_limit_window_minutes}
                            onChange={(e) => updateSetting('rate_limit_window_minutes', parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
