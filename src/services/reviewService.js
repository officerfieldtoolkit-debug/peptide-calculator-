import { supabase } from '../lib/supabase';

export const getReviews = async (peptideName) => {
    try {
        // First try to use the view with profiles
        let { data, error } = await supabase
            .from('reviews_with_profiles')
            .select('*')
            .eq('peptide_name', peptideName)
            .order('created_at', { ascending: false });

        // If view doesn't exist, fall back to regular reviews table
        if (error && error.code === 'PGRST200') {
            const result = await supabase
                .from('reviews')
                .select('*')
                .eq('peptide_name', peptideName)
                .order('created_at', { ascending: false });

            data = result.data;
            error = result.error;
        }

        if (error) throw error;

        // Transform data to include user name
        return (data || []).map(review => ({
            ...review,
            user_name: review.full_name || 'Anonymous'
        }));
    } catch (error) {
        console.warn('Error fetching reviews:', error);
        return [];
    }
};

export const getUserReviews = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.warn('Error fetching user reviews:', error);
        return [];
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.warn('Error deleting review:', error);
        return false;
    }
};

export const submitReview = async (peptideName, rating, comment, userId) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert([
                { peptide_name: peptideName, rating, comment, user_id: userId }
            ])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.warn('Error submitting review:', error);
        throw error;
    }
};
