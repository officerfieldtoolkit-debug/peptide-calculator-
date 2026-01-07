import React, { useState, useEffect } from 'react';
import StackBuilder from '../components/StackBuilder';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const StackProtocol = () => {
    const { user, isPremium, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="padding-container" style={{ padding: '20px 20px 80px' }}>
            <SEO
                title="Peptide Stack Builder | Interaction Checker"
                description="Design your custom peptide stack and check for potential interactions, synergies, and conflicts."
                keywords="peptide stack, interaction checker, stack builder, safety"
            />
            <StackBuilder isPremium={isPremium} />
        </div>
    );
};

export default StackProtocol;
