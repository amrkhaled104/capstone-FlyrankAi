export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  iconName: 'Wrench' | 'Zap' | 'Wind' | 'Tv' | 'Sparkles';
  startingPrice: string;
  providerCount: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  serviceId: string;
  profession: string;
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  experience: string;
  availability: string;
  badges: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'plumbing',
    title: 'Plumbing Services',
    description: 'Pipe leak repairs, drain unclogging, water heater installation, and fixture maintenance.',
    iconName: 'Wrench',
    startingPrice: '$75',
    providerCount: 3,
  },
  {
    id: 'electrical',
    title: 'Electrical & Wiring',
    description: 'Circuit breaker diagnosis, lighting fixtures, EV chargers, and smart switch installation.',
    iconName: 'Zap',
    startingPrice: '$80',
    providerCount: 3,
  },
  {
    id: 'ac-repair',
    title: 'AC & HVAC Maintenance',
    description: 'Cooling diagnostics, freon leak detection, compressor maintenance, and thermostat setup.',
    iconName: 'Wind',
    startingPrice: '$85',
    providerCount: 3,
  },
  {
    id: 'appliance-repair',
    title: 'Appliance Repair',
    description: 'Certified repair for refrigerators, washing machines, dishwashers, and ovens.',
    iconName: 'Tv',
    startingPrice: '$65',
    providerCount: 2,
  },
  {
    id: 'cleaning',
    title: 'Deep Home Cleaning',
    description: 'Thorough post-maintenance sanitization, move-in disinfection, and steam carpet care.',
    iconName: 'Sparkles',
    startingPrice: '$50',
    providerCount: 2,
  },
];

export const SERVICE_PROVIDERS: ServiceProvider[] = [
  // Plumbing Specialists
  {
    id: 'pro-plumb-1',
    name: 'Marcus Vance',
    serviceId: 'plumbing',
    profession: 'Master Plumber',
    rating: 4.95,
    reviewCount: 184,
    hourlyRate: '$75/hr',
    experience: '12 years exp',
    availability: 'Available Today',
    badges: ['Licensed Master', 'Background Checked', 'Emergency Response'],
  },
  {
    id: 'pro-plumb-2',
    name: 'David Kim',
    serviceId: 'plumbing',
    profession: 'Drain & Pipe Specialist',
    rating: 4.88,
    reviewCount: 96,
    hourlyRate: '$65/hr',
    experience: '7 years exp',
    availability: 'Available Today',
    badges: ['Certified Technician', 'Background Checked'],
  },
  {
    id: 'pro-plumb-3',
    name: 'Carlos Mendoza',
    serviceId: 'plumbing',
    profession: 'Water Heater & Fixtures Pro',
    rating: 4.92,
    reviewCount: 142,
    hourlyRate: '$80/hr',
    experience: '10 years exp',
    availability: 'Next Day Slot',
    badges: ['Licensed & Insured', 'Warranty Guaranteed'],
  },

  // Electrical Specialists
  {
    id: 'pro-elec-1',
    name: 'Sarah Jenkins',
    serviceId: 'electrical',
    profession: 'Certified Master Electrician',
    rating: 4.98,
    reviewCount: 310,
    hourlyRate: '$85/hr',
    experience: '14 years exp',
    availability: 'Available Today',
    badges: ['State Certified', 'EV Charging Pro', 'Background Checked'],
  },
  {
    id: 'pro-elec-2',
    name: 'Alan Brooks',
    serviceId: 'electrical',
    profession: 'Residential Wiring Specialist',
    rating: 4.86,
    reviewCount: 115,
    hourlyRate: '$70/hr',
    experience: '8 years exp',
    availability: 'Available Today',
    badges: ['Licensed Electrician', 'Background Checked'],
  },
  {
    id: 'pro-elec-3',
    name: 'Tariq Al-Mansour',
    serviceId: 'electrical',
    profession: 'Breaker Panels & Safety Inspector',
    rating: 4.91,
    reviewCount: 178,
    hourlyRate: '$80/hr',
    experience: '11 years exp',
    availability: 'Available Tomorrow',
    badges: ['Safety Inspector', 'Licensed & Insured'],
  },

  // AC & HVAC Specialists
  {
    id: 'pro-hvac-1',
    name: 'Brian O’Connor',
    serviceId: 'ac-repair',
    profession: 'HVAC Cooling Technician',
    rating: 4.94,
    reviewCount: 220,
    hourlyRate: '$90/hr',
    experience: '13 years exp',
    availability: 'Available Today',
    badges: ['EPA Certified', 'Compressor Specialist', 'Background Checked'],
  },
  {
    id: 'pro-hvac-2',
    name: 'Maya Patel',
    serviceId: 'ac-repair',
    profession: 'Heat Pumps & Duct Systems',
    rating: 4.89,
    reviewCount: 145,
    hourlyRate: '$85/hr',
    experience: '9 years exp',
    availability: 'Available Today',
    badges: ['Certified HVAC', 'Background Checked'],
  },
  {
    id: 'pro-hvac-3',
    name: 'Robert Hayes',
    serviceId: 'ac-repair',
    profession: 'Central Air Diagnostic Tech',
    rating: 4.82,
    reviewCount: 88,
    hourlyRate: '$75/hr',
    experience: '6 years exp',
    availability: 'Available Tomorrow',
    badges: ['Licensed Technician', 'Same-Day Repairs'],
  },

  // Appliance Repair Specialists
  {
    id: 'pro-app-1',
    name: 'Elena Rostova',
    serviceId: 'appliance-repair',
    profession: 'Major Appliance Specialist',
    rating: 4.92,
    reviewCount: 165,
    hourlyRate: '$65/hr',
    experience: '8 years exp',
    availability: 'Available Today',
    badges: ['Certified Technician', 'Multi-Brand Pro', 'Background Checked'],
  },
  {
    id: 'pro-app-2',
    name: 'Kevin Zhang',
    serviceId: 'appliance-repair',
    profession: 'Refrigerator & Washer Tech',
    rating: 4.87,
    reviewCount: 102,
    hourlyRate: '$60/hr',
    experience: '7 years exp',
    availability: 'Available Today',
    badges: ['Certified Technician', 'Background Checked'],
  },

  // Deep Cleaning Specialists
  {
    id: 'pro-clean-1',
    name: 'Sofia Morales',
    serviceId: 'cleaning',
    profession: 'Deep Cleaning Supervisor',
    rating: 4.97,
    reviewCount: 420,
    hourlyRate: '$50/hr',
    experience: '10 years exp',
    availability: 'Available Today',
    badges: ['Sanitization Certified', 'Eco-Friendly Equipment', 'Background Checked'],
  },
  {
    id: 'pro-clean-2',
    name: 'James Bennett',
    serviceId: 'cleaning',
    profession: 'Steam Sanitization Specialist',
    rating: 4.88,
    reviewCount: 130,
    hourlyRate: '$45/hr',
    experience: '6 years exp',
    availability: 'Available Today',
    badges: ['Certified Cleaner', 'Background Checked'],
  },
];

export function getServiceCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES;
}

export function getServiceCategoryById(id: string): ServiceCategory | undefined {
  const normalizedId = id.toLowerCase().trim();
  // Match exact ID or common aliases like 'hvac' -> 'ac-repair'
  if (normalizedId === 'hvac') {
    return SERVICE_CATEGORIES.find((cat) => cat.id === 'ac-repair');
  }
  return SERVICE_CATEGORIES.find((cat) => cat.id === normalizedId);
}

export function getProvidersByServiceId(serviceId: string): ServiceProvider[] {
  const normalizedId = serviceId.toLowerCase().trim();
  const targetId = normalizedId === 'hvac' ? 'ac-repair' : normalizedId;
  return SERVICE_PROVIDERS.filter((pro) => pro.serviceId === targetId);
}
