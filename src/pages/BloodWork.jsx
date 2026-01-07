import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import BloodWorkTracker from '../components/BloodWorkTracker';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const BloodWork = () => {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkPremium = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Check if user has premium subscription
                const { data, error } = await supabase
                    .from('user_subscriptions')
                    .select('plan, status, current_period_end')
                    .eq('user_id', user.id)
                    .single();

                if (data && data.status === 'active' && ['premium', 'pro'].includes(data.plan)) {
                    const isValid = !data.current_period_end || new Date(data.current_period_end) > new Date();
                    setIsPremium(isValid);
                }
            } catch (err) {
                // No subscription found - that's okay, they're on free tier
                console.log('No subscription found');
            } finally {
                setLoading(false);
            }
        };

        checkPremium();
    }, [user]);

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <>
            <SEO
                title="Blood Work Tracker | Lab Results Monitoring"
                description="Track your blood work results over time. Monitor IGF-1, testosterone, A1C, liver enzymes, and more with visual trends."
                keywords="blood work tracker, lab results, IGF-1, testosterone, peptide monitoring"
            />
            <BloodWorkTracker isPremium={isPremium} />
        </>
    );
};

export default BloodWork;
