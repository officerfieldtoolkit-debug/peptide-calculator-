import React from 'react';
import ReconstitutionCalculator from '../components/ReconstitutionCalculator';
import SEO from '../components/SEO';

const Calculator = () => {
    return (
        <div className="padding-container" style={{ padding: '20px' }}>
            <SEO
                title="Peptide Reconstitution Calculator"
                description="Easily calculate peptide reconstitution dosages. Enter your vial size and water amount to get precise injection units."
                canonical="/calculator"
            />
            <ReconstitutionCalculator />
        </div>
    );
};

export default Calculator;
