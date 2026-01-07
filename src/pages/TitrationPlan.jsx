import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import TitrationPlanner from '../components/TitrationPlanner';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const TitrationPlan = () => {
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
                title="Titration Planner | Dose Escalation Schedule"
                description="Plan your semaglutide, tirzepatide, or peptide dose escalation. Visual timeline with reminders and export options."
                keywords="titration planner, semaglutide dosing, tirzepatide schedule, dose escalation"
            />
            <TitrationPlanner isPremium={isPremium} />
        </>
    );
};

export default TitrationPlan;
