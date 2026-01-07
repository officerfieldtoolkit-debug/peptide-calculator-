import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, ExternalLink, Filter, Search, Plus, Flag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import styles from './VendorReviews.module.css';

// Verified vendors list
const vendorsList = [
    { id: 'apollo-peptides', name: 'Apollo Peptides', website: 'apollopeptidesciences.com', verified: true },
    { id: 'peptide-sciences', name: 'Peptide Sciences', website: 'peptidesciences.com', verified: true },
    { id: 'swiss-chems', name: 'Swiss Chems', website: 'swisschems.com', verified: true },
    { id: 'amino-asylum', name: 'Amino Asylum', website: 'aminoasylum.com', verified: false },
    { id: 'paradigm-peptides', name: 'Paradigm Peptides', website: 'paradigmpeptides.com', verified: true },
    { id: 'pure-rawz', name: 'PureRawz', website: 'purerawz.co', verified: false },
    { id: 'biotech-peptides', name: 'Biotech Peptides', website: 'biotechpeptides.com', verified: true },
    { id: 'direct-sarms', name: 'Direct SARMs', website: 'direct-sarms.com', verified: false },
    { id: 'us-peptides', name: 'US Peptides', website: 'uspeptides.com', verified: false },
    { id: 'extreme-peptides', name: 'Extreme Peptides', website: 'extremepeptides.com', verified: false },
    { id: 'proven-peptides', name: 'Proven Peptides', website: 'provenpeptides.com', verified: false },
];

const reviewCategories = [
    { id: 'quality', label: 'Product Quality', icon: '💎' },
    { id: 'shipping', label: 'Shipping Speed', icon: '📦' },
    { id: 'service', label: 'Customer Service', icon: '💬' },
    { id: 'value', label: 'Value for Money', icon: '💰' },
    { id: 'packaging', label: 'Packaging', icon: '🎁' },
];

const VendorReviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [showAddReview, setShowAddReview] = useState(false);
    const [newReview, setNewReview] = useState({
        vendor_id: '',
        ratings: {},
        title: '',
        content: '',
        peptides_ordered: '',
        would_recommend: true,
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('vendor_reviews')
                .select(`
          *,
          profiles:user_id (full_name)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            // Use mock data for now
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!user) {
            alert('Please log in to submit a review');
            return;
        }

        try {
            const { error } = await supabase
                .from('vendor_reviews')
                .insert({
                    user_id: user.id,
                    ...newReview,
                    overall_rating: Object.values(newReview.ratings).reduce((a, b) => a + b, 0) / Object.keys(newReview.ratings).length,
                });

            if (error) throw error;

            setShowAddReview(false);
            setNewReview({
                vendor_id: '',
                ratings: {},
                title: '',
                content: '',
                peptides_ordered: '',
                would_recommend: true,
            });
            fetchReviews();
        } catch (err) {
            console.error('Error submitting review:', err);
        }
    };

    const getVendorStats = (vendorId) => {
        const vendorReviews = reviews.filter(r => r.vendor_id === vendorId);
        if (vendorReviews.length === 0) return { avg: 0, count: 0, recommend: 0 };

        const avg = vendorReviews.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / vendorReviews.length;
        const recommend = vendorReviews.filter(r => r.would_recommend).length / vendorReviews.length * 100;

        return {
            avg: avg.toFixed(1),
            count: vendorReviews.length,
            recommend: Math.round(recommend),
        };
    };

    const filteredVendors = vendorsList.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'recent') return new Date(b.created_at) - new Date(a.created_at);
        if (sortBy === 'highest') return (b.overall_rating || 0) - (a.overall_rating || 0);
        if (sortBy === 'lowest') return (a.overall_rating || 0) - (b.overall_rating || 0);
        if (sortBy === 'helpful') return (b.helpful_count || 0) - (a.helpful_count || 0);
        return 0;
    });

    const displayReviews = selectedVendor
        ? sortedReviews.filter(r => r.vendor_id === selectedVendor.id)
        : sortedReviews;

    const renderStars = (rating, interactive = false, onChange = null) => {
        return (
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        className={`${styles.star} ${star <= rating ? styles.filled : ''}`}
                        onClick={() => interactive && onChange && onChange(star)}
                        disabled={!interactive}
                    >
                        <Star size={interactive ? 24 : 16} fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Vendor Reviews</h1>
                    <p className={styles.subtitle}>Community reviews and ratings of peptide vendors</p>
                </div>
                <button className={styles.addReviewBtn} onClick={() => setShowAddReview(true)}>
                    <Plus size={20} />
                    Write a Review
                </button>
            </div>

            <div className={styles.searchBar}>
                <div className={styles.searchInput}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search vendors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.sortSelect}
                >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                    <option value="helpful">Most Helpful</option>
                </select>
            </div>

            <div className={styles.layout}>
                <aside className={styles.vendorList}>
                    <h3>Vendors</h3>
                    <button
                        className={`${styles.vendorItem} ${!selectedVendor ? styles.active : ''}`}
                        onClick={() => setSelectedVendor(null)}
                    >
                        <span>All Vendors</span>
                        <span className={styles.reviewCount}>{reviews.length}</span>
                    </button>
                    {filteredVendors.map(vendor => {
                        const stats = getVendorStats(vendor.id);
                        return (
                            <button
                                key={vendor.id}
                                className={`${styles.vendorItem} ${selectedVendor?.id === vendor.id ? styles.active : ''}`}
                                onClick={() => setSelectedVendor(vendor)}
                            >
                                <div className={styles.vendorInfo}>
                                    <span className={styles.vendorName}>
                                        {vendor.name}
                                        {vendor.verified && <CheckCircle size={14} className={styles.verifiedBadge} />}
                                    </span>
                                    {stats.count > 0 && (
                                        <div className={styles.vendorRating}>
                                            <Star size={12} fill="currentColor" />
                                            <span>{stats.avg}</span>
                                        </div>
                                    )}
                                </div>
                                <span className={styles.reviewCount}>{stats.count}</span>
                            </button>
                        );
                    })}
                </aside>

                <main className={styles.reviewsSection}>
                    {selectedVendor && (
                        <div className={styles.vendorHeader}>
                            <div className={styles.vendorDetails}>
                                <h2>
                                    {selectedVendor.name}
                                    {selectedVendor.verified && (
                                        <span className={styles.verifiedTag}>
                                            <CheckCircle size={16} /> Verified Vendor
                                        </span>
                                    )}
                                </h2>
                                <a href={`https://${selectedVendor.website}`} target="_blank" rel="noopener noreferrer" className={styles.vendorLink}>
                                    {selectedVendor.website} <ExternalLink size={14} />
                                </a>
                            </div>
                            <div className={styles.vendorStats}>
                                {(() => {
                                    const stats = getVendorStats(selectedVendor.id);
                                    return stats.count > 0 ? (
                                        <>
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>{stats.avg}</span>
                                                <span className={styles.statLabel}>Average Rating</span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>{stats.count}</span>
                                                <span className={styles.statLabel}>Reviews</span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>{stats.recommend}%</span>
                                                <span className={styles.statLabel}>Recommend</span>
                                            </div>
                                        </>
                                    ) : (
                                        <span className={styles.noReviews}>No reviews yet</span>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {displayReviews.length > 0 ? (
                        <div className={styles.reviewsList}>
                            {displayReviews.map(review => {
                                const vendor = vendorsList.find(v => v.id === review.vendor_id);
                                return (
                                    <div key={review.id} className={styles.reviewCard}>
                                        <div className={styles.reviewHeader}>
                                            <div>
                                                <div className={styles.reviewMeta}>
                                                    {!selectedVendor && vendor && (
                                                        <span className={styles.reviewVendor}>{vendor.name}</span>
                                                    )}
                                                    {renderStars(review.overall_rating || 0)}
                                                </div>
                                                <h4 className={styles.reviewTitle}>{review.title}</h4>
                                            </div>
                                            <div className={styles.reviewRecommend}>
                                                {review.would_recommend ? (
                                                    <span className={styles.recommended}>
                                                        <ThumbsUp size={14} /> Recommends
                                                    </span>
                                                ) : (
                                                    <span className={styles.notRecommended}>
                                                        <ThumbsDown size={14} /> Doesn't Recommend
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className={styles.reviewContent}>{review.content}</p>

                                        {review.peptides_ordered && (
                                            <div className={styles.peptidesOrdered}>
                                                <strong>Peptides ordered:</strong> {review.peptides_ordered}
                                            </div>
                                        )}

                                        <div className={styles.reviewFooter}>
                                            <span className={styles.reviewDate}>
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                            <div className={styles.reviewActions}>
                                                <button className={styles.helpfulBtn}>
                                                    <ThumbsUp size={14} />
                                                    Helpful ({review.helpful_count || 0})
                                                </button>
                                                <button className={styles.reportBtn}>
                                                    <Flag size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <AlertTriangle size={48} />
                            <h3>No reviews yet</h3>
                            <p>Be the first to review {selectedVendor ? selectedVendor.name : 'a vendor'}!</p>
                            <button className={styles.addReviewBtn} onClick={() => setShowAddReview(true)}>
                                Write a Review
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Add Review Modal */}
            {showAddReview && (
                <div className={styles.modalOverlay} onClick={() => setShowAddReview(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2>Write a Review</h2>

                        <div className={styles.formGroup}>
                            <label>Select Vendor *</label>
                            <select
                                value={newReview.vendor_id}
                                onChange={e => setNewReview({ ...newReview, vendor_id: e.target.value })}
                            >
                                <option value="">Choose a vendor...</option>
                                {vendorsList.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.ratingsGrid}>
                            {reviewCategories.map(cat => (
                                <div key={cat.id} className={styles.ratingItem}>
                                    <label>{cat.icon} {cat.label}</label>
                                    {renderStars(
                                        newReview.ratings[cat.id] || 0,
                                        true,
                                        (rating) => setNewReview({
                                            ...newReview,
                                            ratings: { ...newReview.ratings, [cat.id]: rating }
                                        })
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Review Title *</label>
                            <input
                                type="text"
                                placeholder="Sum up your experience..."
                                value={newReview.title}
                                onChange={e => setNewReview({ ...newReview, title: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Your Review *</label>
                            <textarea
                                placeholder="Share details about your experience..."
                                rows={4}
                                value={newReview.content}
                                onChange={e => setNewReview({ ...newReview, content: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Peptides Ordered (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g., BPC-157, Semaglutide"
                                value={newReview.peptides_ordered}
                                onChange={e => setNewReview({ ...newReview, peptides_ordered: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Would you recommend this vendor?</label>
                            <div className={styles.recommendToggle}>
                                <button
                                    type="button"
                                    className={`${styles.recommendBtn} ${newReview.would_recommend ? styles.active : ''}`}
                                    onClick={() => setNewReview({ ...newReview, would_recommend: true })}
                                >
                                    <ThumbsUp size={18} /> Yes
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.recommendBtn} ${!newReview.would_recommend ? styles.active : ''}`}
                                    onClick={() => setNewReview({ ...newReview, would_recommend: false })}
                                >
                                    <ThumbsDown size={18} /> No
                                </button>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setShowAddReview(false)}>
                                Cancel
                            </button>
                            <button
                                className={styles.submitBtn}
                                onClick={handleSubmitReview}
                                disabled={!newReview.vendor_id || !newReview.title || !newReview.content}
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorReviews;
