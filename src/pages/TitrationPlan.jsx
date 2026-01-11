import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import TitrationPlanner from '../components/TitrationPlanner';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const TitrationPlan = () => {
    const { user, isPremium, loading } = useAuth();

    // Optional: add a small local loading state if needed, but authenticating loading is usually enough.
    // However, since useAuth loads initially, we can just pass isPremium down.

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <>
            <SEO
                title="Titration Planner | Dose Escalation Schedule"
                description="Plan your semaglutide, tirzepatide, or peptide dose escalation. Visual timeline with reminders and export options."
                canonical="/titration"
            />
            <TitrationPlanner isPremium={isPremium} />
        </>
    );
};

export default TitrationPlan;
