import React from 'react';
import StackBuilder from '../components/StackBuilder';
import SEO from '../components/SEO';

const StackProtocol = () => {
    return (
        <div className="padding-container" style={{ padding: '20px 20px 80px' }}>
            <SEO
                title="Peptide Stack Builder | Interaction Checker"
                description="Design your custom peptide stack and check for potential interactions, synergies, and conflicts."
                keywords="peptide stack, interaction checker, stack builder, safety"
            />
            <StackBuilder />
        </div>
    );
};

export default StackProtocol;
