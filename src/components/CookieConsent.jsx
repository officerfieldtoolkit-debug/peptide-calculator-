import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            maxWidth: '500px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            zIndex: 1000,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                <div style={{
                    padding: '0.5rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '50%',
                    color: '#3b82f6'
                }}>
                    <Cookie size={24} />
                </div>
                <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>We use cookies</h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        We use cookies to enhance your experience, analyze site traffic, and ensure security.
                        By continuing to use our site, you consent to our use of cookies.
                        <a href="/privacy" style={{ color: 'var(--accent-primary)', marginLeft: '0.5rem' }}>Learn more</a>
                    </p>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                    onClick={handleAccept}
                    className="btn-primary"
                    style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
                >
                    Accept All
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
