import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import ThemeToggle from '../ThemeToggle';

const mockSetTheme = vi.fn();
let mockResolvedTheme = 'dark';

vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResolvedTheme = 'dark';
  });

  it('renders button with light theme switch label and sun icon when dark mode is active', () => {
    mockResolvedTheme = 'dark';
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to light theme/i });
    expect(button).toBeInTheDocument();
  });

  it('renders button with dark theme switch label when light mode is active', () => {
    mockResolvedTheme = 'light';
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(button).toBeInTheDocument();
  });

  it('calls setTheme with "light" when clicked in dark mode', () => {
    mockResolvedTheme = 'dark';
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to light theme/i });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('calls setTheme with "dark" when clicked in light mode', () => {
    mockResolvedTheme = 'light';
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark theme/i });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
