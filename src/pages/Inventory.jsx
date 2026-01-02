import React, { useState } from 'react';
import { Package, Plus, Trash2, Edit2, AlertCircle, ShoppingBag, Droplet, Calendar, Search } from 'lucide-react';
import useInventory from '../hooks/useInventory';
import styles from './Inventory.module.css';

const Inventory = () => {
    const {
        inventory,
        addInventory,
        updateInventory,
        deleteInventory,
        getLowStockItems,
        getExpiringItems,
        getTotalStock
    } = useInventory();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        peptide_name: '',
        quantity_mg: '',
        source: '',
        purchase_date: new Date().toISOString().split('T')[0],
        expiration_date: '',
        batch_number: ''
    });

    const lowStockItems = getLowStockItems();
    const expiringItems = getExpiringItems(60); // 60 days alert

    const handleSubmit = async (e) => {
        e.preventDefault();

        const itemData = {
            ...formData,
            quantity_mg: parseFloat(formData.quantity_mg)
        };

        if (editingItem) {
            await updateInventory(editingItem.id, itemData);
        } else {
            await addInventory(itemData);
        }

        closeModal();
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            peptide_name: '',
            quantity_mg: '',
            source: '',
            purchase_date: new Date().toISOString().split('T')[0],
            expiration_date: '',
            batch_number: ''
        });
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            peptide_name: item.peptide_name,
            quantity_mg: item.quantity_mg,
            source: item.source || '',
            purchase_date: item.purchase_date ? item.purchase_date.split('T')[0] : '',
            expiration_date: item.expiration_date ? item.expiration_date.split('T')[0] : '',
            batch_number: item.batch_number || ''
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            await deleteInventory(id);
        }
    };

    // Calculate percent remaining for progress bar
    const getPercentRemaining = (item) => {
        if (!item.quantity_mg || item.quantity_mg === 0) return 0;
        return Math.min(100, Math.max(0, (item.remaining_mg / item.quantity_mg) * 100));
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1><Package className={styles.icon} /> Inventory</h1>
                </div>
                <button className={styles.addButton} onClick={openAddModal}>
                    <Plus size={20} /> Add Item
                </button>
            </header>

            {/* Stats Overview */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                        <Package />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{inventory.length}</span>
                        <span className={styles.statLabel}>Total Items</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                        <Droplet />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{Math.round(getTotalStock())}mg</span>
                        <span className={styles.statLabel}>Total Stock</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                        <AlertCircle />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{lowStockItems.length}</span>
                        <span className={styles.statLabel}>Low Stock</span>
                    </div>
                </div>
            </div>

            {/* Inventory List */}
            {inventory.length > 0 ? (
                <div className={styles.inventoryList}>
                    {inventory.map(item => (
                        <div key={item.id} className={styles.inventoryItem}>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemName}>
                                    {item.peptide_name}
                                    {item.remaining_mg <= 10 && (
                                        <span className={styles.lowStockBadge}>
                                            <AlertCircle size={12} /> Low Stock
                                        </span>
                                    )}
                                </div>
                                <div className={styles.itemDetails}>
                                    <span>{item.remaining_mg}mg remaining (of {item.quantity_mg}mg)</span>
                                    {item.source && <span>• {item.source}</span>}
                                    {item.batch_number && <span>• Batch: {item.batch_number}</span>}
                                </div>
                                <div className={styles.stockBarWrapper}>
                                    <div
                                        className={`${styles.stockBar} ${item.remaining_mg <= 10 ? styles.low : ''}`}
                                        style={{ width: `${getPercentRemaining(item)}%` }}
                                    />
                                </div>
                            </div>

                            <div className={styles.itemActions}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => openEditModal(item)}
                                    title="Edit Item"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                    onClick={() => handleDelete(item.id)}
                                    title="Delete Item"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <ShoppingBag size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <h3>Your inventory is empty</h3>
                    <p>Track your peptide stock, sources, and expiration dates.</p>
                    <button
                        className={styles.addButton}
                        onClick={openAddModal}
                        style={{ marginTop: '1.5rem', marginInline: 'auto' }}
                    >
                        <Plus size={20} /> Add First Item
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {modalOpen && (
                <div className={styles.modal} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>{editingItem ? 'Edit Item' : 'Add to Inventory'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Peptide Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.peptide_name}
                                    onChange={e => setFormData({ ...formData, peptide_name: e.target.value })}
                                    placeholder="e.g. BPC-157"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Quantity (mg)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.1"
                                    value={formData.quantity_mg}
                                    onChange={e => setFormData({ ...formData, quantity_mg: e.target.value })}
                                    placeholder="e.g. 5"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Source / Vendor (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.source}
                                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                                    placeholder="e.g. Biotech Peptides"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Batch Number (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.batch_number}
                                    onChange={e => setFormData({ ...formData, batch_number: e.target.value })}
                                    placeholder="e.g. B492-A"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Purchase Date</label>
                                <input
                                    type="date"
                                    value={formData.purchase_date}
                                    onChange={e => setFormData({ ...formData, purchase_date: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Expiration Date (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.expiration_date}
                                    onChange={e => setFormData({ ...formData, expiration_date: e.target.value })}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    {editingItem ? 'Update Item' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
