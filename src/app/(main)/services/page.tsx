import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, X, Sparkles } from 'lucide-react';
import ServiceCard from '@/components/services/ServiceCard';
import { getServiceCategories, isProfessionMatchingCategory } from '@/lib/services.data';

export const metadata: Metadata = {
  title: 'Services & Trades - HomeServices AI',
  description:
    'Explore verified home repair and maintenance services. Book licensed plumbers, electricians, HVAC specialists, and appliance technicians.',
};

interface ServicesPageProps {
  searchParams?: Promise<{ q?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const query = resolvedParams?.q?.trim().toLowerCase() || '';

  const allCategories = getServiceCategories();
  const categories = query
    ? allCategories.filter((cat) => {
        return (
          cat.title.toLowerCase().includes(query) ||
          cat.description.toLowerCase().includes(query) ||
          cat.id.toLowerCase().includes(query) ||
          isProfessionMatchingCategory(query, cat.id)
        );
      })
    : allCategories;

  return (
    <main className="flex-1 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header with Integrated Search */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-zinc-200/80 pb-8 dark:border-zinc-800">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              Verified Trade Directory
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Home Maintenance Services
            </h1>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              Select a trade service to view available, background-checked specialists with transparent upfront pricing.
            </p>
          </div>

          {/* On-Page Search Services Input */}
          <form
            action="/services"
            method="get"
            role="search"
            className="flex w-full items-center gap-2 sm:w-auto"
          >
            <div className="relative w-full sm:w-72">
              <input
                type="search"
                name="q"
                defaultValue={resolvedParams?.q || ''}
                placeholder="Search services (e.g. plumbing)..."
                className="h-10 w-full rounded-xl border border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-900 shadow-2xs transition placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
              <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Search
            </button>
          </form>
        </div>

        {/* Search Results Filter Banner */}
        {query && (
          <div className="mt-6 flex items-center justify-between rounded-xl bg-blue-50/70 p-4 text-sm text-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
            <p>
              Showing results for: <span className="font-bold">&quot;{resolvedParams?.q}&quot;</span> (
              {categories.length} {categories.length === 1 ? 'service' : 'services'} found)
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 underline hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear Filter</span>
            </Link>
          </div>
        )}

        {/* Services Grid */}
        {categories.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <ServiceCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              No services found matching &quot;{resolvedParams?.q}&quot;
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              We couldn&apos;t find any service category matching your search. Try searching for plumbing, electrical, AC, appliance, or cleaning.
            </p>
            <div className="mt-6">
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                View All Services
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
