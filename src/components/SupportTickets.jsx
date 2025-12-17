import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Clock, CheckCircle, AlertCircle, ChevronRight, Send, ArrowLeft } from 'lucide-react';
import { supportService } from '../services/supportService';
import { useAuth } from '../context/AuthContext';
import styles from './SupportTickets.module.css';

const SupportTickets = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Form state for new ticket
    const [newTicket, setNewTicket] = useState({
        subject: '',
        description: '',
        category: 'general',
        priority: 'normal'
    });

    const categories = supportService.getCategories();
    const priorities = supportService.getPriorities();
    const statuses = supportService.getStatuses();

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const data = await supportService.getMyTickets();
            setTickets(data || []);
        } catch (err) {
            setError('Failed to load tickets');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        if (!newTicket.subject.trim() || !newTicket.description.trim()) return;

        try {
            setSubmitting(true);
            await supportService.createTicket(newTicket);
            setNewTicket({ subject: '', description: '', category: 'general', priority: 'normal' });
            setShowNewTicket(false);
            await loadTickets();
        } catch (err) {
            setError('Failed to create ticket');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTicket) return;

        try {
            setSubmitting(true);
            await supportService.addMessage(selectedTicket.id, newMessage);
            setNewMessage('');
            // Reload ticket to get new message
            const updated = await supportService.getTicket(selectedTicket.id);
            setSelectedTicket(updated);
            await loadTickets();
        } catch (err) {
            setError('Failed to send message');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'open': return <AlertCircle size={16} />;
            case 'in_progress': return <Clock size={16} />;
            case 'resolved': return <CheckCircle size={16} />;
            default: return <MessageCircle size={16} />;
        }
    };

    const getStatusStyle = (status) => {
        const s = statuses.find(st => st.id === status);
        return { color: s?.color || '#6b7280' };
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!user) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <MessageCircle size={48} />
                    <h2>Support Tickets</h2>
                    <p>Please log in to view and create support tickets.</p>
                </div>
            </div>
        );
    }

    // Ticket detail view
    if (selectedTicket) {
        return (
            <div className={styles.container}>
                <button className={styles.backBtn} onClick={() => setSelectedTicket(null)}>
                    <ArrowLeft size={18} />
                    Back to Tickets
                </button>

                <div className={styles.ticketDetail}>
                    <div className={styles.ticketHeader}>
                        <h1>{selectedTicket.subject}</h1>
                        <span className={styles.statusBadge} style={getStatusStyle(selectedTicket.status)}>
                            {getStatusIcon(selectedTicket.status)}
                            {selectedTicket.status.replace('_', ' ')}
                        </span>
                    </div>

                    <div className={styles.ticketMeta}>
                        <span>Category: {categories.find(c => c.id === selectedTicket.category)?.label}</span>
                        <span>Created: {formatDate(selectedTicket.created_at)}</span>
                    </div>

                    <div className={styles.ticketDescription}>
                        <p>{selectedTicket.description}</p>
                    </div>

                    <div className={styles.messagesSection}>
                        <h3>Messages</h3>
                        <div className={styles.messagesList}>
                            {selectedTicket.ticket_messages?.length === 0 && (
                                <p className={styles.noMessages}>No messages yet. Add a reply below.</p>
                            )}
                            {selectedTicket.ticket_messages?.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`${styles.message} ${msg.is_admin_reply ? styles.adminMessage : styles.userMessage}`}
                                >
                                    <div className={styles.messageHeader}>
                                        <span>{msg.is_admin_reply ? '🛡️ Support' : '👤 You'}</span>
                                        <span>{formatDate(msg.created_at)}</span>
                                    </div>
                                    <p>{msg.message}</p>
                                </div>
                            ))}
                        </div>

                        {selectedTicket.status !== 'closed' && (
                            <form onSubmit={handleSendMessage} className={styles.replyForm}>
                                <textarea
                                    placeholder="Type your reply..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    rows={3}
                                />
                                <button type="submit" disabled={submitting || !newMessage.trim()}>
                                    <Send size={18} />
                                    Send Reply
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // New ticket form
    if (showNewTicket) {
        return (
            <div className={styles.container}>
                <button className={styles.backBtn} onClick={() => setShowNewTicket(false)}>
                    <ArrowLeft size={18} />
                    Back to Tickets
                </button>

                <div className="card glass-panel">
                    <h2 className={styles.formTitle}>Create New Ticket</h2>

                    <form onSubmit={handleCreateTicket} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Subject</label>
                            <input
                                type="text"
                                placeholder="Brief description of your issue"
                                value={newTicket.subject}
                                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <select
                                    value={newTicket.category}
                                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Priority</label>
                                <select
                                    value={newTicket.priority}
                                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                >
                                    {priorities.map(p => (
                                        <option key={p.id} value={p.id}>{p.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                placeholder="Please describe your issue in detail..."
                                value={newTicket.description}
                                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                rows={6}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Ticket'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Tickets list
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>
                        <MessageCircle size={28} />
                        Support Tickets
                    </h1>
                    <p>Get help from our support team</p>
                </div>
                <button className={styles.newTicketBtn} onClick={() => setShowNewTicket(true)}>
                    <Plus size={18} />
                    New Ticket
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {loading ? (
                <div className={styles.loading}>Loading tickets...</div>
            ) : tickets.length === 0 ? (
                <div className={styles.emptyState}>
                    <MessageCircle size={48} />
                    <h2>No Tickets Yet</h2>
                    <p>Create a ticket to get help from our support team.</p>
                    <button onClick={() => setShowNewTicket(true)}>
                        <Plus size={18} />
                        Create Your First Ticket
                    </button>
                </div>
            ) : (
                <div className={styles.ticketsList}>
                    {tickets.map(ticket => (
                        <div
                            key={ticket.id}
                            className={styles.ticketCard}
                            onClick={() => setSelectedTicket(ticket)}
                        >
                            <div className={styles.ticketInfo}>
                                <span className={styles.statusBadge} style={getStatusStyle(ticket.status)}>
                                    {getStatusIcon(ticket.status)}
                                    {ticket.status.replace('_', ' ')}
                                </span>
                                <h3>{ticket.subject}</h3>
                                <p>{ticket.description.substring(0, 100)}...</p>
                                <div className={styles.ticketMeta}>
                                    <span>{categories.find(c => c.id === ticket.category)?.label}</span>
                                    <span>•</span>
                                    <span>{formatDate(ticket.updated_at)}</span>
                                    <span>•</span>
                                    <span>{ticket.ticket_messages?.length || 0} messages</span>
                                </div>
                            </div>
                            <ChevronRight size={20} className={styles.chevron} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupportTickets;
