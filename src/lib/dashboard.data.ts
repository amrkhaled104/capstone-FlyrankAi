export interface CustomerBooking {
  id: string;
  serviceTitle: string;
  category: string;
  providerName: string;
  providerRole: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  price: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  rating?: number;
}

export interface ProviderRequest {
  id: string;
  customerName: string;
  serviceTitle: string;
  category: string;
  requestedDate: string;
  requestedTime: string;
  address: string;
  distance: string;
  estimatedPayout: string;
  status: 'pending' | 'accepted' | 'declined';
  urgency: 'urgent' | 'standard';
  notes?: string;
}

export interface ProviderCompletedJob {
  id: string;
  customerName: string;
  serviceTitle: string;
  completedDate: string;
  payout: string;
  rating: number;
  review?: string;
}

export const INITIAL_CUSTOMER_ACTIVE_BOOKINGS: CustomerBooking[] = [
  {
    id: 'book-101',
    serviceTitle: 'Emergency Pipe Leak Repair',
    category: 'Plumbing Services',
    providerName: 'Marcus Vance',
    providerRole: 'Master Plumber',
    scheduledDate: 'Today',
    scheduledTime: '2:30 PM',
    address: '742 Evergreen Terrace, Springfield',
    price: '$75/hr (est. $150)',
    status: 'in-progress',
  },
  {
    id: 'book-102',
    serviceTitle: 'Central AC Seasonal Diagnostic',
    category: 'AC & HVAC Maintenance',
    providerName: 'Brian O’Connor',
    providerRole: 'HVAC Cooling Technician',
    scheduledDate: 'Tomorrow, Oct 10',
    scheduledTime: '10:00 AM',
    address: '742 Evergreen Terrace, Springfield',
    price: '$90/hr',
    status: 'confirmed',
  },
];

export const INITIAL_CUSTOMER_PAST_BOOKINGS: CustomerBooking[] = [
  {
    id: 'book-098',
    serviceTitle: 'Main Circuit Breaker Inspection',
    category: 'Electrical & Wiring',
    providerName: 'Sarah Jenkins',
    providerRole: 'Certified Master Electrician',
    scheduledDate: 'Sep 28, 2026',
    scheduledTime: '1:00 PM',
    address: '742 Evergreen Terrace, Springfield',
    price: '$85.00',
    status: 'completed',
    rating: 5.0,
  },
  {
    id: 'book-091',
    serviceTitle: 'Deep Kitchen & Tile Sanitization',
    category: 'Deep Home Cleaning',
    providerName: 'Sofia Morales',
    providerRole: 'Deep Cleaning Supervisor',
    scheduledDate: 'Sep 15, 2026',
    scheduledTime: '9:30 AM',
    address: '742 Evergreen Terrace, Springfield',
    price: '$110.00',
    status: 'completed',
    rating: 5.0,
  },
];

export const INITIAL_PROVIDER_REQUESTS: ProviderRequest[] = [
  {
    id: 'req-301',
    customerName: 'Jessica Miller',
    serviceTitle: 'Burst Pipe Under Kitchen Sink',
    category: 'Plumbing Services',
    requestedDate: 'Today',
    requestedTime: 'Before 5:00 PM',
    address: '144 Oak Street, North End',
    distance: '1.2 miles away',
    estimatedPayout: '$170 est.',
    status: 'pending',
    urgency: 'urgent',
    notes: 'Water is currently turned off at the main valve. Need urgent replacement.',
  },
  {
    id: 'req-302',
    customerName: 'David Reynolds',
    serviceTitle: 'Water Heater Diagnostic & Thermostat Check',
    category: 'Plumbing Services',
    requestedDate: 'Tomorrow, Oct 10',
    requestedTime: '9:00 AM',
    address: '82 Pine Avenue, Westside',
    distance: '3.5 miles away',
    estimatedPayout: '$160 est.',
    status: 'pending',
    urgency: 'standard',
    notes: 'Water temperature fluctuates randomly between lukewarm and scalding.',
  },
  {
    id: 'req-303',
    customerName: 'Elena Vance',
    serviceTitle: 'Bathroom Faucet & Fixture Upgrade',
    category: 'Plumbing Services',
    requestedDate: 'Oct 14, 2026',
    requestedTime: '11:00 AM',
    address: '520 Elm Street, Suite 4',
    distance: '2.0 miles away',
    estimatedPayout: '$120 est.',
    status: 'pending',
    urgency: 'standard',
    notes: 'Already purchased new matte black fixtures, need professional installation.',
  },
];

export const INITIAL_PROVIDER_COMPLETED_JOBS: ProviderCompletedJob[] = [
  {
    id: 'job-201',
    customerName: 'Michael Chang',
    serviceTitle: 'Emergency Main Valve Repair',
    completedDate: 'Oct 05, 2026',
    payout: '$240.00',
    rating: 5.0,
    review: 'Showed up in under 30 minutes and resolved the issue cleanly.',
  },
  {
    id: 'job-194',
    customerName: 'Rachel Adams',
    serviceTitle: 'Commercial Sump Pump Diagnosis',
    completedDate: 'Oct 01, 2026',
    payout: '$310.00',
    rating: 4.9,
    review: 'Extremely thorough inspection and transparent pricing.',
  },
  {
    id: 'job-188',
    customerName: 'Thomas Wright',
    serviceTitle: 'Garbage Disposal Replacement',
    completedDate: 'Sep 25, 2026',
    payout: '$150.00',
    rating: 5.0,
    review: 'Fast, polite, and left the workspace spotless.',
  },
];
