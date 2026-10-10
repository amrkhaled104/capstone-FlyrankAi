import '@testing-library/jest-dom/vitest';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProviderCard from '@/components/services/ProviderCard';
import { ServiceProvider } from '@/lib/services.data';

describe('ProviderCard component', () => {
  const mockProvider: ServiceProvider = {
    id: 'tech-123',
    name: 'Sarah Connor',
    serviceId: 'plumbing',
    profession: 'Plumbing Specialist',
    rating: 4.9,
    reviewCount: 38,
    hourlyRate: '$85/hr',
    experience: '8 years exp',
    availability: 'Available Today',
    badges: ['Licensed Master', 'Background Checked'],
    address: 'Austin, TX',
  };

  it('renders technician personal and service information properly', () => {
    render(<ProviderCard provider={mockProvider} />);

    expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
    expect(screen.getByText('Plumbing Specialist')).toBeInTheDocument();
    expect(screen.getByText('$85/hr')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('(38 reviews)')).toBeInTheDocument();
    expect(screen.getByText('8 years exp')).toBeInTheDocument();
    expect(screen.getByText('Available Today')).toBeInTheDocument();
    expect(screen.getByText('Austin, TX')).toBeInTheDocument();
  });

  it('handles booking action button click and shows confirmation status', () => {
    render(<ProviderCard provider={mockProvider} />);

    const bookButton = screen.getByRole('button', { name: /book service with sarah connor/i });
    expect(bookButton).toBeInTheDocument();

    fireEvent.click(bookButton);

    expect(screen.getByText('Request Sent!')).toBeInTheDocument();
    expect(screen.getByText('View in Bookings')).toBeInTheDocument();
  });
});
