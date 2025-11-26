import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import React from 'react';

// Mock Supabase
vi.mock('../src/lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
            onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
            signInWithPassword: vi.fn(),
            signOut: vi.fn()
        }
    }
}));

const TestComponent = () => {
    const { user, signIn, signOut } = useAuth();
    return (
        <div>
            <div data-testid="user-status">{user ? 'Logged In' : 'Logged Out'}</div>
            <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
            <button onClick={() => signOut()}>Sign Out</button>
        </div>
    );
};

describe('AuthContext', () => {
    it('renders children and provides auth context', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        // AuthProvider starts with loading=true, so it renders nothing initially.
        // We need to wait for it to finish loading (which happens after getSession resolves).
        expect(await screen.findByTestId('user-status')).toHaveTextContent('Logged Out');
    });
});
