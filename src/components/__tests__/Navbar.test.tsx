import '@testing-library/jest-dom/vitest';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import * as firebaseAuth from 'firebase/auth';
import * as nextNavigation from 'next/navigation';

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/auth')>();
  return {
    ...actual,
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
  };
});

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual,
    getFirestore: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn().mockResolvedValue({
      exists: () => false,
      data: () => ({}),
    }),
  };
});

vi.mock('@/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

describe('Navbar component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (firebaseAuth.onAuthStateChanged as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (_auth, callback) => {
        callback(null);
        return () => {};
      }
    );
  });

  it('renders guest navigation with Sign In and Sign Up when not logged in', () => {
    render(<Navbar />);

    expect(screen.getAllByRole('link', { name: /sign in/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /sign up/i })[0]).toBeInTheDocument();
    expect(screen.queryByLabelText(/user profile menu/i)).not.toBeInTheDocument();
  });

  it('hides Search Services form when navigating to non-services routes', () => {
    vi.spyOn(nextNavigation, 'usePathname').mockReturnValue('/');
    render(<Navbar />);

    expect(screen.queryByPlaceholderText(/search services/i)).not.toBeInTheDocument();
  });

  it('shows Search Services form when navigating to /services page', () => {
    vi.spyOn(nextNavigation, 'usePathname').mockReturnValue('/services');
    render(<Navbar />);

    expect(screen.getByPlaceholderText(/search services/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search services/i })).toBeInTheDocument();
  });

  it('renders dynamic name next to avatar derived from applicant email when authenticated', async () => {
    // Simulate user authenticated with email applicant@example.com and no displayName
    (firebaseAuth.onAuthStateChanged as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (_auth, callback) => {
        callback({
          uid: 'user-456',
          email: 'applicant@example.com',
          displayName: null,
        });
        return () => {};
      }
    );

    render(<Navbar />);

    await waitFor(() => {
      // Name should be dynamically derived from applicant email (Applicant), not hardcoded Amr
      expect(screen.getByText('Applicant')).toBeInTheDocument();
    });

    // Check that avatar initial reflects the dynamic name
    expect(screen.getByText('A')).toBeInTheDocument();

    // Check that profile button contains the name next to avatar
    const profileButton = screen.getByRole('button', { name: /user profile menu/i });
    expect(profileButton).toBeInTheDocument();
    expect(profileButton).toHaveTextContent('Applicant');

    // Click profile dropdown and verify menu opens showing applicant email
    fireEvent.click(profileButton);

    expect(screen.getByText('Signed in as')).toBeInTheDocument();
    expect(screen.getByText('applicant@example.com')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
  });

  it('renders explicit displayName when present on user profile', async () => {
    (firebaseAuth.onAuthStateChanged as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (_auth, callback) => {
        callback({
          uid: 'user-789',
          email: 'alex.smith@test.com',
          displayName: 'Alex Smith',
        });
        return () => {};
      }
    );

    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getByText('Alex Smith')).toBeInTheDocument();
    });

    const profileButton = screen.getByRole('button', { name: /user profile menu/i });
    expect(profileButton).toHaveTextContent('Alex Smith');
  });
});
