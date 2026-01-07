import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback for missing env vars to prevent immediate crash
const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
    console.error('Supabase is not configured. Missing environment variables.');
}

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        // Mock client that returns errors but doesn't crash app
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signUp: async () => ({ error: { message: 'Supabase not configured' } }),
            signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
            signOut: async () => ({ error: null }),
        },
        from: () => ({
            select: () => ({ data: [], error: { message: 'Supabase not configured' } }),
            insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            eq: function () { return this; },
            order: function () { return this; },
            single: () => ({ data: null, error: { message: 'Supabase not configured' } }),
        })
    };

