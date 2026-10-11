export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  iconName: 'Wrench' | 'Zap' | 'Wind' | 'Tv' | 'Sparkles';
  startingPrice: string;
  providerCount?: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  serviceId?: string;
  profession: string;
  rating?: number;
  reviewCount?: number;
  hourlyRate?: string;
  experience?: string;
  availability?: string;
  badges?: string[];
  phone?: string;
  address?: string;
  bio?: string;
  email?: string;
  isPublished?: boolean;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'plumbing',
    title: 'Plumbing Services',
    description: 'Pipe leak repairs, drain unclogging, water heater installation, and fixture maintenance.',
    iconName: 'Wrench',
    startingPrice: '$75',
  },
  {
    id: 'electrical',
    title: 'Electrical & Wiring',
    description: 'Circuit breaker diagnosis, lighting fixtures, EV chargers, and smart switch installation.',
    iconName: 'Zap',
    startingPrice: '$80',
  },
  {
    id: 'ac-repair',
    title: 'AC & HVAC Maintenance',
    description: 'Cooling diagnostics, freon leak detection, compressor maintenance, and thermostat setup.',
    iconName: 'Wind',
    startingPrice: '$85',
  },
  {
    id: 'appliance-repair',
    title: 'Appliance Repair',
    description: 'Certified repair for refrigerators, washing machines, dishwashers, and ovens.',
    iconName: 'Tv',
    startingPrice: '$65',
  },
  {
    id: 'cleaning',
    title: 'Deep Home Cleaning',
    description: 'Thorough post-maintenance sanitization, move-in disinfection, and steam carpet care.',
    iconName: 'Sparkles',
    startingPrice: '$50',
  },
];

export function getServiceCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES;
}

export function getServiceCategoryById(id: string): ServiceCategory | undefined {
  if (!id) return undefined;
  const normalizedId = id.toLowerCase().trim();
  // Match exact ID or common aliases like 'hvac' -> 'ac-repair'
  if (normalizedId === 'hvac') {
    return SERVICE_CATEGORIES.find((cat) => cat.id === 'ac-repair');
  }
  return SERVICE_CATEGORIES.find((cat) => cat.id === normalizedId);
}

/**
 * Normalizes and checks if a technician's recorded profession or category matches
 * a given service category ID, title, or trade keywords.
 */
export function isProfessionMatchingCategory(
  userProfession: string | undefined | null,
  categoryId: string
): boolean {
  if (!userProfession || !categoryId) return false;
  const p = userProfession.toLowerCase().trim();
  const cId = categoryId.toLowerCase().trim();
  const targetId = cId === 'hvac' ? 'ac-repair' : cId;
  const category = getServiceCategoryById(targetId);
  const cTitle = category?.title.toLowerCase().trim() || '';

  // Direct matches against ID or title
  if (p === targetId || p === cId || (cTitle && p === cTitle)) {
    return true;
  }

  // Substring / keyword matches based on trade
  if (targetId === 'plumbing' && p.includes('plumb')) return true;
  if (targetId === 'electrical' && (p.includes('electr') || p.includes('wiring'))) return true;
  if (targetId === 'ac-repair' && (p.includes('ac') || p.includes('hvac') || p.includes('cool') || p.includes('heat'))) return true;
  if (targetId === 'appliance-repair' && p.includes('appliance')) return true;
  if (targetId === 'cleaning' && (p.includes('clean') || p.includes('sanitiz'))) return true;

  return false;
}
