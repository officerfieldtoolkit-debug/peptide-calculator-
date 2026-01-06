/**
 * Hook Integration Tests
 * Tests for custom React hooks
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

// Mock Supabase
const mockPeptides = [
    { id: 1, name: 'BPC-157', category: 'Healing Peptide', description: 'Test', half_life_hours: 4 },
    { id: 2, name: 'Semaglutide', category: 'GLP-1', description: 'Test', half_life_hours: 168 },
    { id: 3, name: 'TB-500', category: 'Healing Peptide', description: 'Test', half_life_hours: 12 },
];

vi.mock('../src/lib/supabase', () => ({
    supabase: {
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: mockPeptides, error: null }),
            }),
        }),
    }
}));

describe('usePeptides Hook', () => {
    let usePeptides;

    beforeEach(async () => {
        const module = await import('../src/hooks/usePeptides.js');
        usePeptides = module.usePeptides;
    });

    it('returns peptides after loading', async () => {
        const { result } = renderHook(() => usePeptides());

        // Initially loading
        expect(result.current.loading).toBe(true);

        // Wait for data
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.peptides).toHaveLength(3);
        expect(result.current.error).toBeNull();
    });

    it('getPeptideByName finds correct peptide', async () => {
        const { result } = renderHook(() => usePeptides());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const peptide = result.current.getPeptideByName('BPC-157');
        expect(peptide).toBeDefined();
        expect(peptide.name).toBe('BPC-157');
    });

    it('getPeptideByName is case insensitive', async () => {
        const { result } = renderHook(() => usePeptides());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const peptide = result.current.getPeptideByName('bpc-157');
        expect(peptide).toBeDefined();
        expect(peptide.name).toBe('BPC-157');
    });

    it('getPeptidesByCategory filters correctly', async () => {
        const { result } = renderHook(() => usePeptides());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const healingPeptides = result.current.getPeptidesByCategory('Healing Peptide');
        expect(healingPeptides).toHaveLength(2);
        expect(healingPeptides.every(p => p.category === 'Healing Peptide')).toBe(true);
    });

    it('transforms half_life_hours to halfLife string', async () => {
        const { result } = renderHook(() => usePeptides());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const peptide = result.current.peptides[0];
        expect(peptide.halfLife).toBe('4 hours');
    });
});

describe('useOnboarding Hook', () => {
    let useOnboarding;

    beforeEach(async () => {
        // Clear localStorage before each test
        localStorage.clear();

        // Reset modules to ensure fresh state
        vi.resetModules();

        // Mock AuthContext
        vi.doMock('../src/context/AuthContext', () => ({
            useAuth: () => ({ user: null })
        }));

        const module = await import('../src/hooks/useOnboarding.js');
        useOnboarding = module.useOnboarding;
    });

    it('returns initial state for new users', async () => {
        const { result } = renderHook(() => useOnboarding());

        // Wait for loading to complete
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // New user should see onboarding
        expect(result.current.showOnboarding).toBe(true);
        expect(typeof result.current.completeOnboarding).toBe('function');
        expect(typeof result.current.skipOnboarding).toBe('function');
    });

    it('completeOnboarding hides the wizard', async () => {
        const { result } = renderHook(() => useOnboarding());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.showOnboarding).toBe(true);

        // Call completeOnboarding and wait for state update
        await result.current.completeOnboarding();

        await waitFor(() => {
            expect(result.current.showOnboarding).toBe(false);
        });
    });

    it('skipOnboarding hides the wizard', async () => {
        const { result } = renderHook(() => useOnboarding());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.showOnboarding).toBe(true);

        result.current.skipOnboarding();

        await waitFor(() => {
            expect(result.current.showOnboarding).toBe(false);
        });
    });

    it('persists onboarding completion to localStorage', async () => {
        const { result } = renderHook(() => useOnboarding());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await result.current.completeOnboarding();

        // Check localStorage was set
        expect(localStorage.getItem('peptidelog_onboarding_complete')).toBe('true');
    });
});
