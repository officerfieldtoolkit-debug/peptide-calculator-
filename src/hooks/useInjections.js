import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useInjections = () => {
    const [injections, setInjections] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchInjections();
        } else {
            setInjections([]);
            setLoading(false);
        }
    }, [user]);

    const fetchInjections = async () => {
        try {
            const { data, error } = await supabase
                .from('injections')
                .select('*')
                .order('injection_date', { ascending: false });

            if (error) throw error;

            // Map database fields to frontend model if needed
            const formattedData = data.map(item => ({
                id: item.id,
                peptide: item.peptide_name,
                dosage: item.dosage_mcg,
                unit: 'mcg', // Database stores in mcg
                date: item.injection_date,
                notes: item.notes,
                site: 'Abdomen' // Default or add to schema if needed
            }));

            setInjections(formattedData);
        } catch (error) {
            console.error('Error fetching injections:', error);
        } finally {
            setLoading(false);
        }
    };

    const addInjection = async (injection) => {
        if (!user) return;

        try {
            // Optimistic update
            const newInjection = {
                ...injection,
                id: 'temp-' + Date.now(),
                date: injection.date || new Date().toISOString()
            };
            setInjections([newInjection, ...injections]);

            const { data, error } = await supabase
                .from('injections')
                .insert([{
                    user_id: user.id,
                    peptide_name: injection.peptide,
                    dosage_mcg: injection.unit === 'mg' ? injection.dosage * 1000 : injection.dosage,
                    injection_date: injection.date || new Date().toISOString(),
                    notes: injection.notes
                }])
                .select()
                .single();

            if (error) throw error;

            // Replace temp ID with real one
            setInjections(prev => prev.map(i =>
                i.id === newInjection.id ? {
                    ...i,
                    id: data.id,
                    dosage: injection.dosage, // Keep original unit for display
                    unit: injection.unit
                } : i
            ));

            // Refresh to ensure sync
            fetchInjections();

        } catch (error) {
            console.error('Error adding injection:', error);
            // Revert optimistic update
            fetchInjections();
        }
    };

    const deleteInjection = async (id) => {
        try {
            // Optimistic update
            setInjections(injections.filter(i => i.id !== id));

            const { error } = await supabase
                .from('injections')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting injection:', error);
            fetchInjections();
        }
    };

    return {
        injections,
        loading,
        addInjection,
        deleteInjection
    };
};
