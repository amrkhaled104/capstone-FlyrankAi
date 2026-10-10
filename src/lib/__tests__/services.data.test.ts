import { describe, it, expect } from 'vitest';
import * as servicesData from '@/lib/services.data';
import {
  SERVICE_CATEGORIES,
  getServiceCategories,
  getServiceCategoryById,
  isProfessionMatchingCategory,
} from '@/lib/services.data';

describe('services.data module refactoring', () => {
  it('does not export any static SERVICE_PROVIDERS array', () => {
    // Assert that mock providers array has been completely removed
    expect((servicesData as Record<string, unknown>)['SERVICE_PROVIDERS']).toBeUndefined();
    expect((servicesData as Record<string, unknown>)['getProvidersByServiceId']).toBeUndefined();
  });

  it('retains all expected service categories', () => {
    const categories = getServiceCategories();
    expect(categories).toHaveLength(5);
    expect(SERVICE_CATEGORIES).toHaveLength(5);

    const ids = categories.map((cat) => cat.id);
    expect(ids).toContain('plumbing');
    expect(ids).toContain('electrical');
    expect(ids).toContain('ac-repair');
    expect(ids).toContain('appliance-repair');
    expect(ids).toContain('cleaning');
  });

  describe('getServiceCategoryById', () => {
    it('finds categories by exact ID', () => {
      const plumbing = getServiceCategoryById('plumbing');
      expect(plumbing).toBeDefined();
      expect(plumbing?.title).toBe('Plumbing Services');
    });

    it('resolves common category aliases such as hvac to ac-repair', () => {
      const hvac = getServiceCategoryById('hvac');
      expect(hvac).toBeDefined();
      expect(hvac?.id).toBe('ac-repair');
      expect(hvac?.title).toBe('AC & HVAC Maintenance');
    });

    it('returns undefined for non-existent IDs', () => {
      expect(getServiceCategoryById('unknown-trade')).toBeUndefined();
      expect(getServiceCategoryById('')).toBeUndefined();
    });
  });

  describe('isProfessionMatchingCategory', () => {
    it('matches exact category IDs and titles', () => {
      expect(isProfessionMatchingCategory('plumbing', 'plumbing')).toBe(true);
      expect(isProfessionMatchingCategory('Plumbing Services', 'plumbing')).toBe(true);
      expect(isProfessionMatchingCategory('Electrical & Wiring', 'electrical')).toBe(true);
      expect(isProfessionMatchingCategory('AC & HVAC Maintenance', 'ac-repair')).toBe(true);
      expect(isProfessionMatchingCategory('Appliance Repair', 'appliance-repair')).toBe(true);
      expect(isProfessionMatchingCategory('Deep Home Cleaning', 'cleaning')).toBe(true);
    });

    it('matches trade keyword variations', () => {
      expect(isProfessionMatchingCategory('Master Plumber', 'plumbing')).toBe(true);
      expect(isProfessionMatchingCategory('Drain & Pipe Technician', 'plumbing')).toBe(false);
      expect(isProfessionMatchingCategory('Licensed Plumber', 'plumbing')).toBe(true);
      expect(isProfessionMatchingCategory('Certified Electrician', 'electrical')).toBe(true);
      expect(isProfessionMatchingCategory('Commercial HVAC Specialist', 'ac-repair')).toBe(true);
      expect(isProfessionMatchingCategory('AC Cooling Expert', 'ac-repair')).toBe(true);
      expect(isProfessionMatchingCategory('Home Appliance Technician', 'appliance-repair')).toBe(true);
      expect(isProfessionMatchingCategory('Sanitization & Cleaning Pro', 'cleaning')).toBe(true);
    });

    it('returns false for mismatched or empty professions', () => {
      expect(isProfessionMatchingCategory('Interior Painter', 'plumbing')).toBe(false);
      expect(isProfessionMatchingCategory('Roofer', 'electrical')).toBe(false);
      expect(isProfessionMatchingCategory('', 'plumbing')).toBe(false);
      expect(isProfessionMatchingCategory(null, 'plumbing')).toBe(false);
      expect(isProfessionMatchingCategory(undefined, 'plumbing')).toBe(false);
    });
  });

  describe('isPublished field handling', () => {
    it('accepts isPublished boolean property on ServiceProvider', () => {
      const publishedProvider: servicesData.ServiceProvider = {
        id: 'pro-pub-1',
        name: 'Jane Doe',
        profession: 'Electrician',
        isPublished: true,
      };
      expect(publishedProvider.isPublished).toBe(true);

      const unpublishedProvider: servicesData.ServiceProvider = {
        id: 'pro-pub-2',
        name: 'John Doe',
        profession: 'Plumber',
        isPublished: false,
      };
      expect(unpublishedProvider.isPublished).toBe(false);
    });
  });
});
