// Support Ticket Service
// Handles creating, viewing, and managing support tickets

import { supabase } from '../lib/supabase';

export const supportService = {
    // Get all tickets for current user
    async getMyTickets() {
        const { data, error } = await supabase
            .from('support_tickets')
            .select(`
        *,
        ticket_messages (
          id,
          message,
          is_admin_reply,
          created_at
        )
      `)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get a single ticket with messages
    async getTicket(ticketId) {
        const { data, error } = await supabase
            .from('support_tickets')
            .select(`
        *,
        ticket_messages (
          id,
          message,
          is_admin_reply,
          created_at,
          user_id
        )
      `)
            .eq('id', ticketId)
            .single();

        if (error) throw error;
        return data;
    },

    // Create a new ticket
    async createTicket({ subject, description, category = 'general', priority = 'normal' }) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Must be logged in to create a ticket');

        const { data, error } = await supabase
            .from('support_tickets')
            .insert({
                user_id: user.id,
                subject,
                description,
                category,
                priority
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Add a message to a ticket
    async addMessage(ticketId, message, isAdminReply = false) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Must be logged in to send a message');

        const { data, error } = await supabase
            .from('ticket_messages')
            .insert({
                ticket_id: ticketId,
                user_id: user.id,
                message,
                is_admin_reply: isAdminReply
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Admin: Get all tickets
    async getAllTickets(status = null) {
        let query = supabase
            .from('support_tickets')
            .select(`
        *,
        profiles:user_id (
          email,
          full_name
        ),
        ticket_messages (
          id
        )
      `)
            .order('updated_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    // Admin: Update ticket status
    async updateTicketStatus(ticketId, status) {
        const { data: { user } } = await supabase.auth.getUser();

        const updateData = { status };

        if (status === 'resolved') {
            updateData.resolved_at = new Date().toISOString();
            updateData.resolved_by = user.id;
        }

        const { data, error } = await supabase
            .from('support_tickets')
            .update(updateData)
            .eq('id', ticketId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get ticket categories
    getCategories() {
        return [
            { id: 'general', label: 'General Inquiry' },
            { id: 'bug', label: 'Bug Report' },
            { id: 'feature', label: 'Feature Request' },
            { id: 'account', label: 'Account Issue' },
            { id: 'billing', label: 'Billing' },
            { id: 'other', label: 'Other' }
        ];
    },

    // Get priority levels
    getPriorities() {
        return [
            { id: 'low', label: 'Low', color: '#10b981' },
            { id: 'normal', label: 'Normal', color: '#3b82f6' },
            { id: 'high', label: 'High', color: '#f59e0b' },
            { id: 'urgent', label: 'Urgent', color: '#ef4444' }
        ];
    },

    // Get status options
    getStatuses() {
        return [
            { id: 'open', label: 'Open', color: '#3b82f6' },
            { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
            { id: 'waiting', label: 'Waiting for User', color: '#8b5cf6' },
            { id: 'resolved', label: 'Resolved', color: '#10b981' },
            { id: 'closed', label: 'Closed', color: '#6b7280' }
        ];
    }
};
