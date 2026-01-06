import React, { useState, useRef, useEffect } from 'react';
import {
    Share2, Copy, Check, X, ExternalLink,
    Twitter, Facebook, Linkedin, Mail, MessageCircle
} from 'lucide-react';
import styles from './SocialShare.module.css';

// Reddit icon (not in lucide)
const RedditIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
);

/**
 * SocialShare - A comprehensive social sharing component
 * Shows a dropdown with multiple sharing options
 * 
 * @param {string} title - Title for the share (used in tweets, etc)
 * @param {string} description - Description text
 * @param {string} url - URL to share (defaults to current page)
 * @param {string} hashtags - Comma-separated hashtags for Twitter
 * @param {string} variant - 'button' | 'icon' | 'inline'
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
const SocialShare = ({
    title = '',
    description = '',
    url = typeof window !== 'undefined' ? window.location.href : '',
    hashtags = 'peptides,biohacking',
    variant = 'button',
    size = 'md',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [justShared, setJustShared] = useState(false);
    const [isSharing, setIsSharing] = useState(false); // Prevent race condition with native share
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const shareTitle = title || document.title;
    const shareDescription = description || 'Check out this peptide tool on PeptideLog!';

    const shareOptions = [
        {
            name: 'Twitter / X',
            icon: Twitter,
            color: '#1DA1F2',
            bgColor: 'rgba(29, 161, 242, 0.15)',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: '#1877F2',
            bgColor: 'rgba(24, 119, 242, 0.15)',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareTitle)}`
        },
        {
            name: 'Reddit',
            icon: RedditIcon,
            color: '#FF4500',
            bgColor: 'rgba(255, 69, 0, 0.15)',
            url: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareTitle)}`
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: '#0A66C2',
            bgColor: 'rgba(10, 102, 194, 0.15)',
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareDescription)}`
        },
        {
            name: 'Email',
            icon: Mail,
            color: '#EA4335',
            bgColor: 'rgba(234, 67, 53, 0.15)',
            url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription}\n\n${url}`)}`
        }
    ];

    const handleNativeShare = async () => {
        // Prevent multiple simultaneous share attempts
        if (isSharing) return false;

        const shareData = {
            title: shareTitle,
            text: shareDescription,
            url: url
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                setIsSharing(true);
                await navigator.share(shareData);
                setJustShared(true);
                setTimeout(() => setJustShared(false), 2000);
                setIsOpen(false);
                return true;
            } catch (err) {
                if (err.name === 'AbortError') return false;
                // Ignore InvalidStateError for race conditions
                if (err.name === 'InvalidStateError') return false;
                console.error('Share failed:', err);
            } finally {
                setIsSharing(false);
            }
        }
        return false;
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShareClick = async () => {
        // Try native share first on mobile
        if (typeof navigator !== 'undefined' && navigator.share) {
            const shared = await handleNativeShare();
            if (shared) return;
        }
        // Otherwise toggle the dropdown
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        window.open(option.url, '_blank', 'width=600,height=400,noopener,noreferrer');
        setIsOpen(false);
        setJustShared(true);
        setTimeout(() => setJustShared(false), 2000);
    };

    const sizeClasses = {
        sm: styles.sizeSm,
        md: styles.sizeMd,
        lg: styles.sizeLg
    };

    const variantClasses = {
        button: styles.variantButton,
        icon: styles.variantIcon,
        inline: styles.variantInline
    };

    return (
        <div className={`${styles.container} ${className}`} ref={menuRef}>
            {/* Share Button */}
            <button
                className={`${styles.shareButton} ${sizeClasses[size]} ${variantClasses[variant]}`}
                onClick={handleShareClick}
                aria-label="Share this page"
                aria-expanded={isOpen}
            >
                {justShared ? (
                    <>
                        <Check size={size === 'lg' ? 20 : 16} className={styles.successIcon} />
                        {variant !== 'icon' && <span>Shared!</span>}
                    </>
                ) : (
                    <>
                        <Share2 size={size === 'lg' ? 20 : 16} />
                        {variant !== 'icon' && <span>Share</span>}
                    </>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                        <span>Share this page</span>
                        <button
                            className={styles.closeButton}
                            onClick={() => setIsOpen(false)}
                            aria-label="Close share menu"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Copy Link */}
                    <button
                        className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                        onClick={handleCopyLink}
                    >
                        <div className={styles.copyIcon}>
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </div>
                        <div className={styles.copyText}>
                            <span className={styles.copyLabel}>
                                {copied ? 'Copied!' : 'Copy Link'}
                            </span>
                            <span className={styles.copyUrl}>{url.length > 40 ? url.substring(0, 40) + '...' : url}</span>
                        </div>
                    </button>

                    {/* Divider */}
                    <div className={styles.divider}>
                        <span>or share via</span>
                    </div>

                    {/* Social Options */}
                    <div className={styles.socialGrid}>
                        {shareOptions.map((option) => (
                            <button
                                key={option.name}
                                className={styles.socialButton}
                                onClick={() => handleOptionClick(option)}
                                style={{ '--social-color': option.color, '--social-bg': option.bgColor }}
                                aria-label={`Share on ${option.name}`}
                            >
                                <div className={styles.socialIcon}>
                                    <option.icon size={20} />
                                </div>
                                <span className={styles.socialName}>{option.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialShare;
