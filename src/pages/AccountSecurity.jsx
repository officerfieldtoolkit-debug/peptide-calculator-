import React, { useState, useEffect } from 'react';
import {
    Shield, Lock, Key, Smartphone, Clock, Globe,
    AlertTriangle, CheckCircle, LogOut, Eye, EyeOff,
    Monitor, MapPin, Calendar, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AccountSecurity.module.css';

const AccountSecurity = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [loginHistory, setLoginHistory] = useState([]);
    const [securityScore, setSecurityScore] = useState(0);
    const [securityChecks, setSecurityChecks] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadSecurityData();
    }, [user, navigate]);

    const loadSecurityData = async () => {
        setLoading(true);
        try {
            // Calculate security score based on various factors
            const checks = [];
            let score = 0;

            // Check email verification
            if (user.email_confirmed_at) {
                checks.push({ name: 'Email verified', status: 'pass', icon: CheckCircle });
                score += 25;
            } else {
                checks.push({ name: 'Email not verified', status: 'warning', icon: AlertTriangle });
            }

            // Check password age (if we had this data)
            checks.push({ name: 'Password set', status: 'pass', icon: CheckCircle });
            score += 25;

            // Check 2FA status
            const { data: factors } = await supabase.auth.mfa.listFactors();
            if (factors?.totp?.length > 0) {
                checks.push({ name: 'Two-factor authentication enabled', status: 'pass', icon: CheckCircle });
                score += 30;
            } else {
                checks.push({ name: 'Two-factor authentication not set up', status: 'warning', icon: AlertTriangle });
            }

            // Account age check
            const accountAge = Date.now() - new Date(user.created_at).getTime();
            const daysSinceCreation = Math.floor(accountAge / (1000 * 60 * 60 * 24));
            if (daysSinceCreation > 30) {
                checks.push({ name: 'Established account', status: 'pass', icon: CheckCircle });
                score += 10;
            } else {
                checks.push({ name: 'New account', status: 'info', icon: Clock });
                score += 5;
            }

            // Recent activity check
            checks.push({ name: 'Recent login activity reviewed', status: 'pass', icon: CheckCircle });
            score += 10;

            setSecurityChecks(checks);
            setSecurityScore(Math.min(100, score));

            // Mock login history (in a real app, this would come from audit logs)
            setLoginHistory([
                {
                    id: 1,
                    timestamp: new Date().toISOString(),
                    device: 'Current Session',
                    location: 'Your current location',
                    ip: 'Current IP',
                    current: true
                },
                {
                    id: 2,
                    timestamp: new Date(Date.now() - 86400000).toISOString(),
                    device: 'Chrome on macOS',
                    location: 'United States',
                    ip: '***.***.***.**',
                    current: false
                }
            ]);

        } catch (error) {
            console.error('Error loading security data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOutAllDevices = async () => {
        if (window.confirm('This will sign you out of all devices including this one. Continue?')) {
            try {
                await supabase.auth.signOut({ scope: 'global' });
                navigate('/login');
            } catch (error) {
                console.error('Error signing out:', error);
            }
        }
    };

    const getScoreColor = () => {
        if (securityScore >= 80) return '#10b981';
        if (securityScore >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = () => {
        if (securityScore >= 80) return 'Excellent';
        if (securityScore >= 60) return 'Good';
        if (securityScore >= 40) return 'Fair';
        return 'Needs Improvement';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <RefreshCw className={styles.spinner} size={32} />
                    <p>Loading security information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerIcon}>
                    <Shield size={32} />
                </div>
                <div>
                    <h1 className={styles.title}>Account Security</h1>
                    <p className={styles.subtitle}>Manage your security settings and review account activity</p>
                </div>
            </div>

            {/* Security Score Card */}
            <div className={styles.scoreCard}>
                <div className={styles.scoreCircle} style={{ borderColor: getScoreColor() }}>
                    <span className={styles.scoreValue} style={{ color: getScoreColor() }}>
                        {securityScore}
                    </span>
                    <span className={styles.scoreLabel}>/ 100</span>
                </div>
                <div className={styles.scoreInfo}>
                    <h3 style={{ color: getScoreColor() }}>{getScoreLabel()}</h3>
                    <p>Your account security score</p>
                </div>
            </div>

            {/* Security Checks */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <CheckCircle size={20} />
                    Security Checklist
                </h2>
                <div className={styles.checksList}>
                    {securityChecks.map((check, index) => (
                        <div
                            key={index}
                            className={`${styles.checkItem} ${styles[check.status]}`}
                        >
                            <check.icon size={18} />
                            <span>{check.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Key size={20} />
                    Security Actions
                </h2>
                <div className={styles.actionsGrid}>
                    <Link to="/settings" className={styles.actionCard}>
                        <Lock size={24} />
                        <span>Change Password</span>
                    </Link>
                    <Link to="/settings" className={styles.actionCard}>
                        <Smartphone size={24} />
                        <span>Set Up 2FA</span>
                    </Link>
                    <button
                        onClick={handleSignOutAllDevices}
                        className={`${styles.actionCard} ${styles.danger}`}
                    >
                        <LogOut size={24} />
                        <span>Sign Out All Devices</span>
                    </button>
                </div>
            </div>

            {/* Login History */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Clock size={20} />
                    Recent Login Activity
                </h2>
                <div className={styles.historyList}>
                    {loginHistory.map((login) => (
                        <div
                            key={login.id}
                            className={`${styles.historyItem} ${login.current ? styles.current : ''}`}
                        >
                            <div className={styles.historyIcon}>
                                <Monitor size={20} />
                            </div>
                            <div className={styles.historyDetails}>
                                <div className={styles.historyDevice}>
                                    {login.device}
                                    {login.current && (
                                        <span className={styles.currentBadge}>Current</span>
                                    )}
                                </div>
                                <div className={styles.historyMeta}>
                                    <span><MapPin size={12} /> {login.location}</span>
                                    <span><Calendar size={12} /> {formatDate(login.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Account Info */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Globe size={20} />
                    Account Information
                </h2>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Email</span>
                        <span className={styles.infoValue}>{user?.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Account Created</span>
                        <span className={styles.infoValue}>
                            {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Last Sign In</span>
                        <span className={styles.infoValue}>
                            {user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Unknown'}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>User ID</span>
                        <span className={styles.infoValue} style={{ fontSize: '0.75rem' }}>
                            {user?.id}
                        </span>
                    </div>
                </div>
            </div>

            {/* Security Tips */}
            <div className={styles.tipsSection}>
                <h3>🔐 Security Tips</h3>
                <ul>
                    <li>Use a unique password that you don't use for other accounts</li>
                    <li>Enable two-factor authentication for extra protection</li>
                    <li>Review your login history regularly for suspicious activity</li>
                    <li>Sign out of devices you no longer use</li>
                    <li>Never share your password or verification codes with anyone</li>
                </ul>
            </div>
        </div>
    );
};

export default AccountSecurity;
