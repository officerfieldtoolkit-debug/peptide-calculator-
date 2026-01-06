/**
 * Component Integration Tests
 * Tests for core UI components
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock Supabase
vi.mock('../src/lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
            onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        },
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
                eq: vi.fn().mockResolvedValue({ data: [], error: null }),
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
        }),
    }
}));

// Helper to render with Router
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('SocialShare Component', () => {
    let SocialShare;

    beforeEach(async () => {
        // Dynamic import to avoid hoisting issues
        const module = await import('../src/components/SocialShare.jsx');
        SocialShare = module.default;
    });

    it('renders share button', async () => {
        renderWithRouter(<SocialShare title="Test Share" />);

        const shareButton = await screen.findByRole('button', { name: /share this page/i });
        expect(shareButton).toBeInTheDocument();
    });

    it('shows dropdown when clicked (no native share)', async () => {
        // Mock navigator.share to not exist
        const originalShare = navigator.share;
        delete navigator.share;

        renderWithRouter(<SocialShare title="Test Share" url="https://example.com" />);

        const shareButton = await screen.findByRole('button', { name: /share this page/i });
        fireEvent.click(shareButton);

        // Should show dropdown with social options
        await waitFor(() => {
            expect(screen.getByText('Share this page')).toBeInTheDocument();
            expect(screen.getByText(/copy link/i)).toBeInTheDocument();
        });

        // Restore
        if (originalShare) navigator.share = originalShare;
    });

    it('displays all social share options', async () => {
        delete navigator.share;

        renderWithRouter(<SocialShare title="Test" />);

        const shareButton = await screen.findByRole('button', { name: /share this page/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            expect(screen.getByText('Twitter / X')).toBeInTheDocument();
            expect(screen.getByText('Facebook')).toBeInTheDocument();
            expect(screen.getByText('Reddit')).toBeInTheDocument();
            expect(screen.getByText('LinkedIn')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
        });
    });

    it('copies link to clipboard', async () => {
        delete navigator.share;

        // Mock clipboard
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: { writeText }
        });

        renderWithRouter(<SocialShare title="Test" url="https://test.com" />);

        const shareButton = await screen.findByRole('button', { name: /share this page/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            expect(screen.getByText(/copy link/i)).toBeInTheDocument();
        });

        const copyButton = screen.getByText(/copy link/i).closest('button');
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(writeText).toHaveBeenCalledWith('https://test.com');
        });
    });

    it('closes dropdown when clicking close button', async () => {
        delete navigator.share;

        renderWithRouter(<SocialShare title="Test" />);

        const shareButton = await screen.findByRole('button', { name: /share this page/i });
        fireEvent.click(shareButton);

        await waitFor(() => {
            expect(screen.getByText('Share this page')).toBeInTheDocument();
        });

        const closeButton = screen.getByRole('button', { name: /close share menu/i });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText('Share this page')).not.toBeInTheDocument();
        });
    });
});

describe('ShareButton Component', () => {
    let ShareButton;

    beforeEach(async () => {
        const module = await import('../src/components/ShareButton.jsx');
        ShareButton = module.default;
    });

    it('renders as wrapper for SocialShare', async () => {
        renderWithRouter(<ShareButton title="Test" text="Description" />);

        // ShareButton should render the SocialShare button
        const shareButton = await screen.findByRole('button', { name: /share this page/i });
        expect(shareButton).toBeInTheDocument();
    });
});
