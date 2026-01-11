import React from 'react';
import SEO from '../components/SEO';
import VendorReviews from '../components/VendorReviews';

const Reviews = () => {
    return (
        <>
            <SEO
                title="Vendor Reviews | Peptide Supplier Ratings"
                description="Community reviews and ratings of peptide vendors. Find trusted suppliers with verified reviews from real users."
                canonical="/reviews"
            />
            <VendorReviews />
        </>
    );
};

export default Reviews;
