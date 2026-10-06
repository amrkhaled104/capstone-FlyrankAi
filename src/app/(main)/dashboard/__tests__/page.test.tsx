import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from '../page';
import { signOut } from 'firebase/auth';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback({ email: 'testuser@example.com' });
    return () => {};
  }),
  signOut: vi.fn().mockResolvedValue(undefined),
  getAuth: vi.fn(),
}));

describe('DashboardPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome header, notice banner, and user email', async () => {
    render(<DashboardPage />);

    expect(screen.getByText(/temporary role-based redirect dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/welcome back, testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/authenticated as testuser@example.com/i)).toBeInTheDocument();
  });

  it('switches between Customer and Technician preview modes', async () => {
    render(<DashboardPage />);

    // Customer mode is active by default
    expect(screen.getByText(/customer management panel/i)).toBeInTheDocument();
    expect(screen.getByText(/smart diagnostics/i)).toBeInTheDocument();

    // Click Technician toggle
    const technicianBtn = screen.getByRole('button', { name: /technician/i });
    fireEvent.click(technicianBtn);

    expect(screen.getByText(/technician operations panel/i)).toBeInTheDocument();
    expect(screen.getByText(/incoming job requests/i)).toBeInTheDocument();

    // Click Customer toggle back
    const customerBtn = screen.getByRole('button', { name: /customer/i });
    fireEvent.click(customerBtn);

    expect(screen.getByText(/customer management panel/i)).toBeInTheDocument();
  });

  it('signs out and redirects user to /login', async () => {
    render(<DashboardPage />);

    const signOutBtn = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(signOutBtn);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
