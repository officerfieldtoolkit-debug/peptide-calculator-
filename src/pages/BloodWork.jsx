import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import BloodWorkTracker from '../components/BloodWorkTracker';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const BloodWork = () => {
    const { user, isPremium, loading } = useAuth();

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
