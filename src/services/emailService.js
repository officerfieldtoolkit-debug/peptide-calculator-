// This is a client-side mock of an email service.
// In a real production app, this would call a Supabase Edge Function
// which would then use an SMTP provider like Resend, SendGrid, or AWS SES.

import { supabase } from '../lib/supabase';

export const emailService = {
    /**
     * Helper to invoke the edge function
     */
    async _sendEmail(type, email, data = {}) {
        try {
            const { data: response, error } = await supabase.functions.invoke('send-email', {
                body: { type, email, data }
            });

            if (error) throw error;
            return { success: true, data: response };
        } catch (error) {
            console.error(`[Email Service] Failed to send ${type} email:`, error);
            // Fallback for dev/demo if function not deployed
            if (error.message.includes('Functions') || error.status === 404) {
                console.warn('Edge Function not found. Is it deployed? Falling back to console log.');
                return { success: true, simulated: true };
            }
            return { success: false, error };
        }
    },

    sendWelcomeEmail: async (email, name) => {
        return emailService._sendEmail('welcome', email, { name });
    },

    sendPasswordReset: async (email) => {
        // Supabase Auth sends this automatically if configured, 
        // but this manual trigger is useful for custom flows.
        return emailService._sendEmail('reset_password', email, { url: window.location.origin + '/reset' });
    },

    sendTestReminder: async (email) => {
        return emailService._sendEmail('test', email);
    },

    updatePreferences: async (userId, preferences) => {
        // This still goes directly to the DB, not an email function
        try {
            const { error } = await supabase
                .from('profiles')
                .update(preferences)
                .eq('id', userId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error updating preferences:', error);
            return { success: false, error };
        }
    }
};
