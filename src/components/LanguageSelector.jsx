import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    // Add more languages here as translations are added
    // { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    // { code: 'fr', name: 'Français', flag: '🇫🇷' },
    // { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

const LanguageSelector = ({ variant = 'dropdown' }) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('peptide_language', code);
        setIsOpen(false);
        // Optionally refresh to apply translations everywhere
        // window.location.reload();
    };

    // Compact button style for navigation
    if (variant === 'compact') {
        return (
            <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s'
                    }}
                    aria-label="Change language"
                    aria-expanded={isOpen}
                >
                    <span style={{ fontSize: '1.1rem' }}>{currentLanguage.flag}</span>
                    <ChevronDown size={14} style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                    }} />
                </button>

                {isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '0.5rem',
                        background: 'rgba(15, 23, 42, 0.98)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
                        overflow: 'hidden',
                        zIndex: 1000,
                        minWidth: '160px'
                    }}>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: i18n.language === lang.code ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    textAlign: 'left',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (i18n.language !== lang.code) {
                                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = i18n.language === lang.code
                                        ? 'rgba(59, 130, 246, 0.15)'
                                        : 'transparent';
                                }}
                            >
                                <span style={{ fontSize: '1.25rem' }}>{lang.flag}</span>
                                <span style={{ flex: 1 }}>{lang.name}</span>
                                {i18n.language === lang.code && (
                                    <Check size={16} style={{ color: '#3b82f6' }} />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Full dropdown style (for settings page)
    return (
        <div ref={menuRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.875rem 1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.2s'
                }}
                aria-label="Change language"
                aria-expanded={isOpen}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Globe size={20} style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ fontSize: '1.25rem' }}>{currentLanguage.flag}</span>
                    <span>{currentLanguage.name}</span>
                </div>
                <ChevronDown size={18} style={{
                    color: 'var(--text-secondary)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                }} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '0.5rem',
                    background: 'rgba(15, 23, 42, 0.98)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden',
                    zIndex: 1000
                }}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                width: '100%',
                                padding: '1rem',
                                background: i18n.language === lang.code ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                textAlign: 'left',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (i18n.language !== lang.code) {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = i18n.language === lang.code
                                    ? 'rgba(59, 130, 246, 0.15)'
                                    : 'transparent';
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
                            <span style={{ flex: 1 }}>{lang.name}</span>
                            {i18n.language === lang.code && (
                                <Check size={18} style={{ color: '#3b82f6' }} />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
