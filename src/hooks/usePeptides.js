import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const usePeptides = () => {
    const [peptides, setPeptides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPeptides = async () => {
            try {
                const { data, error } = await supabase
                    .from('peptides')
                    .select('*')
                    .order('name');

                if (error) throw error;

                setPeptides(data);
            } catch (err) {
                console.error('Error fetching peptides:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPeptides();
    }, []);

    const getPeptideByName = (name) => {
        return peptides.find(p => p.name === name);
    };

    const getPeptidesByCategory = (category) => {
        return peptides.filter(p => p.category === category);
    };

    return {
        peptides,
        loading,
        error,
        getPeptideByName,
        getPeptidesByCategory
    };
};
