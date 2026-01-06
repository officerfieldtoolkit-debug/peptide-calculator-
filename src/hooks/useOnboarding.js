import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const ONBOARDING_KEY = 'peptidelog_onboarding_complete';

/**
 * Hook to manage user onboarding state
 * Tracks whether a user has completed the onboarding wizard
 * Uses localStorage for guests, Supabase profiles for authenticated users
 */
export const useOnboarding = () => {
    const { user } = useAuth();
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check onboarding status on mount
    useEffect(() => {
        const checkOnboardingStatus = async () => {
            setLoading(true);

            try {
                if (user) {
                    // For authenticated users, check their profile
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('onboarding_complete')
                        .eq('id', user.id)
                        .single();

                    if (error && error.code !== 'PGRST116') {
                        console.warn('Error checking onboarding status:', error);
                    }

                    // Show onboarding if not completed
                    const isComplete = profile?.onboarding_complete === true;
                    setShowOnboarding(!isComplete);
                } else {
                    // For guests, check localStorage
                    const isComplete = localStorage.getItem(ONBOARDING_KEY) === 'true';
                    setShowOnboarding(!isComplete);
                }
            } catch (err) {
                console.error('Error checking onboarding:', err);
                setShowOnboarding(false);
            } finally {
                setLoading(false);
            }
        };

        checkOnboardingStatus();
    }, [user]);

    // Mark onboarding as complete
    const completeOnboarding = useCallback(async () => {
        try {
            if (user) {
                // Update profile in Supabase
                await supabase
                    .from('profiles')
                    .update({ onboarding_complete: true })
                    .eq('id', user.id);
            }

            // Always save to localStorage as backup
            localStorage.setItem(ONBOARDING_KEY, 'true');
            setShowOnboarding(false);
        } catch (err) {
            console.error('Error completing onboarding:', err);
            // Still hide the wizard even on error
            localStorage.setItem(ONBOARDING_KEY, 'true');
            setShowOnboarding(false);
        }
    }, [user]);

    // Skip onboarding (same as complete, but can be tracked differently if needed)
    const skipOnboarding = useCallback(() => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
        setShowOnboarding(false);
    }, []);

    // Reset onboarding (for testing/re-showing)
    const resetOnboarding = useCallback(async () => {
        try {
            if (user) {
                await supabase
                    .from('profiles')
                    .update({ onboarding_complete: false })
                    .eq('id', user.id);
            }
            localStorage.removeItem(ONBOARDING_KEY);
            setShowOnboarding(true);
        } catch (err) {
            console.error('Error resetting onboarding:', err);
        }
    }, [user]);

    return {
        showOnboarding,
        loading,
        completeOnboarding,
        skipOnboarding,
        resetOnboarding
    };
};

export default useOnboarding;
