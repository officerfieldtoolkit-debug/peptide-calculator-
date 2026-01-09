import React, { useState, useEffect } from 'react';
import {
    Tag, Plus, Trash2, Copy, Check, RefreshCw, Calendar,
    Users, Percent, DollarSign, Gift, X, Save
} from 'lucide-react';
import styles from './AdminPromoCodes.module.css';

const AdminPromoCodes = () => {
    const [loading, setLoading] = useState(true);
    const [codes, setCodes] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [newCode, setNewCode] = useState({
        code: '',
        discount_type: 'percent',
        discount_value: 10,
        max_uses: 100,
        expires_at: '',
        min_purchase: 0,
        is_active: true,
        description: ''
    });

    const defaultCodes = [
        { id: 1, code: 'WELCOME20', discount_type: 'percent', discount_value: 20, uses: 45, max_uses: 100, expires_at: '2026-12-31', is_active: true, description: 'New user welcome discount', created_at: '2026-01-01' },
        { id: 2, code: 'PREMIUM50', discount_type: 'percent', discount_value: 50, uses: 12, max_uses: 50, expires_at: '2026-06-30', is_active: true, description: 'Premium subscription 50% off', created_at: '2026-01-01' },
        { id: 3, code: 'FREEMONTH', discount_type: 'fixed', discount_value: 9.99, uses: 5, max_uses: 20, expires_at: '2026-03-31', is_active: false, description: 'One month free', created_at: '2026-01-01' }
    ];

    useEffect(() => {
        loadCodes();
    }, []);

    const loadCodes = async () => {
        setLoading(true);
        try {
            const stored = localStorage.getItem('admin_promo_codes');
            if (stored) {
                setCodes(JSON.parse(stored));
            } else {
                setCodes(defaultCodes);
                localStorage.setItem('admin_promo_codes', JSON.stringify(defaultCodes));
            }
        } catch (error) {
            console.error('Error loading promo codes:', error);
            setCodes(defaultCodes);
        } finally {
            setLoading(false);
        }
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewCode(prev => ({ ...prev, code }));
    };

    const handleAdd = () => {
        const id = Math.max(...codes.map(c => c.id), 0) + 1;
        const code = {
            ...newCode,
            id,
            uses: 0,
            created_at: new Date().toISOString()
        };
        const updated = [code, ...codes];
        setCodes(updated);
        localStorage.setItem('admin_promo_codes', JSON.stringify(updated));
        setShowAddModal(false);
        setNewCode({
            code: '',
            discount_type: 'percent',
            discount_value: 10,
            max_uses: 100,
            expires_at: '',
            min_purchase: 0,
            is_active: true,
            description: ''
        });
    };

    const toggleActive = (id) => {
        const updated = codes.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c);
        setCodes(updated);
        localStorage.setItem('admin_promo_codes', JSON.stringify(updated));
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this promo code?')) {
            const updated = codes.filter(c => c.id !== id);
            setCodes(updated);
            localStorage.setItem('admin_promo_codes', JSON.stringify(updated));
        }
    };

    const copyCode = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatDiscount = (code) => {
        if (code.discount_type === 'percent') {
            return `${code.discount_value}% off`;
        }
        return `$${code.discount_value} off`;
    };

    const isExpired = (date) => {
        if (!date) return false;
        return new Date(date) < new Date();
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <RefreshCw className={styles.spinner} size={32} />
                <p>Loading promo codes...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Promo Codes</h1>
                    <p>Create and manage discount codes</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className={styles.addBtn}>
                    <Plus size={18} />
                    Create Code
                </button>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
                <div className={styles.stat}>
                    <Gift size={20} color="#10b981" />
                    <span>{codes.filter(c => c.is_active).length}</span>
                    <label>Active</label>
                </div>
                <div className={styles.stat}>
                    <Users size={20} color="#3b82f6" />
                    <span>{codes.reduce((sum, c) => sum + (c.uses || 0), 0)}</span>
                    <label>Total Uses</label>
                </div>
                <div className={styles.stat}>
                    <DollarSign size={20} color="#f59e0b" />
                    <span>${codes.reduce((sum, c) => sum + ((c.uses || 0) * (c.discount_type === 'fixed' ? c.discount_value : 5)), 0).toFixed(0)}</span>
                    <label>Est. Savings</label>
                </div>
            </div>

            {/* Codes Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Usage</th>
                            <th>Expires</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {codes.map(code => (
                            <tr key={code.id} className={!code.is_active ? styles.inactive : ''}>
                                <td>
                                    <div className={styles.codeCell}>
                                        <code className={styles.codeText}>{code.code}</code>
                                        <button
                                            onClick={() => copyCode(code.code, code.id)}
                                            className={styles.copyBtn}
                                        >
                                            {copiedId === code.id ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    {code.description && (
                                        <span className={styles.codeDesc}>{code.description}</span>
                                    )}
                                </td>
                                <td>
                                    <span className={styles.discount}>
                                        {code.discount_type === 'percent' ? <Percent size={14} /> : <DollarSign size={14} />}
                                        {formatDiscount(code)}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.usage}>
                                        <span>{code.uses || 0} / {code.max_uses}</span>
                                        <div className={styles.usageBar}>
                                            <div
                                                style={{ width: `${((code.uses || 0) / code.max_uses) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {code.expires_at ? (
                                        <span className={isExpired(code.expires_at) ? styles.expired : ''}>
                                            {new Date(code.expires_at).toLocaleDateString()}
                                        </span>
                                    ) : 'Never'}
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleActive(code.id)}
                                        className={`${styles.statusBadge} ${code.is_active ? styles.active : styles.inactive}`}
                                    >
                                        {code.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(code.id)}
                                        className={styles.deleteBtn}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2><Tag size={20} /> Create Promo Code</h2>
                            <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.field}>
                                <label>Code</label>
                                <div className={styles.codeInput}>
                                    <input
                                        type="text"
                                        value={newCode.code}
                                        onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                                        placeholder="SUMMER2026"
                                    />
                                    <button onClick={generateCode} type="button">Generate</button>
                                </div>
                            </div>
                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label>Discount Type</label>
                                    <select
                                        value={newCode.discount_type}
                                        onChange={(e) => setNewCode({ ...newCode, discount_type: e.target.value })}
                                    >
                                        <option value="percent">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label>Discount Value</label>
                                    <input
                                        type="number"
                                        value={newCode.discount_value}
                                        onChange={(e) => setNewCode({ ...newCode, discount_value: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label>Max Uses</label>
                                    <input
                                        type="number"
                                        value={newCode.max_uses}
                                        onChange={(e) => setNewCode({ ...newCode, max_uses: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Expiry Date</label>
                                    <input
                                        type="date"
                                        value={newCode.expires_at}
                                        onChange={(e) => setNewCode({ ...newCode, expires_at: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={newCode.description}
                                    onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                                    placeholder="Optional description"
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowAddModal(false)} className={styles.cancelBtn}>Cancel</button>
                            <button onClick={handleAdd} className={styles.saveBtn} disabled={!newCode.code}>
                                <Save size={16} />
                                Create Code
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPromoCodes;
