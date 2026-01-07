import React from 'react';
import SEO from '../components/SEO';
import InjectionSiteMap from '../components/InjectionSiteMap';

const InjectionSites = () => {
    return (
        <>
            <SEO
                title="Injection Site Guide | Where to Inject Peptides"
                description="Interactive guide to safe injection sites for peptide administration. Learn proper subcutaneous and intramuscular injection techniques."
                keywords="injection sites, subcutaneous, intramuscular, peptide injection, BPC-157, semaglutide"
            />
            <InjectionSiteMap />
        </>
    );
};

export default InjectionSites;
