import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader, ShieldX } from 'lucide-react';

/**
 * AdminRoute - Protects routes that require admin privileges
 * Checks if the current user has is_admin = true in their profile
 */
const AdminRoute = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error checking admin status:', error);
                    setIsAdmin(false);
                } else {
                    setIsAdmin(data?.is_admin === true);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            checkAdminStatus();
        }
    }, [user, authLoading]);

    // Still loading auth or admin status
    if (authLoading || loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: '1rem'
            }}>
                <Loader className="animate-spin" size={32} />
                <p style={{ color: 'var(--text-secondary)' }}>Checking permissions...</p>
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Not an admin - show access denied
    if (!isAdmin) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: '1.5rem',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ShieldX size={40} color="#ef4444" />
                </div>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Access Denied</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                    You don't have permission to access the admin panel.
                    This area is restricted to administrators only.
                </p>
                <a
                    href="/"
                    className="btn-primary"
                    style={{ textDecoration: 'none' }}
                >
                    Return to Home
                </a>
            </div>
        );
    }

    // User is admin - render the protected content
    return children;
};

export default AdminRoute;
