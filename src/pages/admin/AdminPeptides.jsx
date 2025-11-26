import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminPeptides = () => {
    const [peptides, setPeptides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'Weight Loss',
        half_life_hours: '',
        description: '',
        benefits: '', // comma separated
        side_effects: '', // comma separated
        warnings: '' // comma separated
    });

    useEffect(() => {
        fetchPeptides();
    }, []);

    const fetchPeptides = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('peptides')
                .select('*')
                .order('name');

            if (error) throw error;
            setPeptides(data || []);
        } catch (error) {
            console.error('Error fetching peptides:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (peptide) => {
        setEditingId(peptide.id);
        setFormData({
            name: peptide.name,
            category: peptide.category,
            half_life_hours: peptide.half_life_hours || '',
            description: peptide.description || '',
            benefits: (peptide.benefits || []).join(', '),
            side_effects: (peptide.side_effects || []).join(', '),
            warnings: (peptide.warnings || []).join(', ')
        });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setFormData({
            name: '',
            category: 'Weight Loss',
            half_life_hours: '',
            description: '',
            benefits: '',
            side_effects: '',
            warnings: ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this peptide?')) return;

        try {
            const { error } = await supabase
                .from('peptides')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchPeptides();
        } catch (error) {
            console.error('Error deleting peptide:', error);
            alert('Failed to delete peptide');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            category: formData.category,
            half_life_hours: formData.half_life_hours ? parseFloat(formData.half_life_hours) : null,
            description: formData.description,
            benefits: formData.benefits.split(',').map(s => s.trim()).filter(Boolean),
            side_effects: formData.side_effects.split(',').map(s => s.trim()).filter(Boolean),
            warnings: formData.warnings.split(',').map(s => s.trim()).filter(Boolean)
        };

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('peptides')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('peptides')
                    .insert([payload]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchPeptides();
        } catch (error) {
            console.error('Error saving peptide:', error);
            alert('Failed to save peptide');
        }
    };

    const filteredPeptides = peptides.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Manage Peptides</h1>
                <button className="btn-primary" onClick={handleAddNew}>
                    <Plus size={20} />
                    Add Peptide
                </button>
            </div>

            <div className="card glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.5)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    <Search size={20} color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder="Search peptides..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                    />
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredPeptides.map(peptide => (
                        <div key={peptide.id} className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0' }}>{peptide.name}</h3>
                                <span style={{
                                    background: 'var(--accent-primary)',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    opacity: 0.8
                                }}>
                                    {peptide.category}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleEdit(peptide)}
                                    style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(peptide.id)}
                                    style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div className="card glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ margin: 0 }}>{editingId ? 'Edit Peptide' : 'New Peptide'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                    >
                                        <option>Weight Loss</option>
                                        <option>Muscle Building</option>
                                        <option>Recovery</option>
                                        <option>Anti-Aging</option>
                                        <option>Cognitive</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Half Life (Hours)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.half_life_hours}
                                    onChange={e => setFormData({ ...formData, half_life_hours: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Benefits (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.benefits}
                                    onChange={e => setFormData({ ...formData, benefits: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Side Effects (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.side_effects}
                                    onChange={e => setFormData({ ...formData, side_effects: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                                {editingId ? 'Update Peptide' : 'Create Peptide'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPeptides;
