import React from 'react';
import type { Metadata } from 'next';
import ServiceCard from '@/components/services/ServiceCard';
import { getServiceCategories } from '@/lib/services.data';

export const metadata: Metadata = {
  title: 'Services & Trades - HomeServices AI',
  description:
    'Explore verified home repair and maintenance services. Book licensed plumbers, electricians, HVAC specialists, and appliance technicians.',
};

export default function ServicesPage() {
  const categories = getServiceCategories();

  return (
    <main className="flex-1 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Home Maintenance Services
          </h1>

          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Select a trade service to view available, background-checked specialists with transparent upfront pricing.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <ServiceCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </main>
  );
}
