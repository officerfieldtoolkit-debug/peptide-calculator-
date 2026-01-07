import React from 'react';
import SEO from '../components/SEO';
import VendorReviews from '../components/VendorReviews';

const Reviews = () => {
    return (
        <>
            <SEO
                title="Vendor Reviews | Peptide Supplier Ratings"
                description="Community reviews and ratings of peptide vendors. Find trusted suppliers with verified reviews from real users."
                keywords="peptide vendor reviews, peptide supplier ratings, peptide sources, trusted vendors"
            />
            <VendorReviews />
        </>
    );
};

export default Reviews;
