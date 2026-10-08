import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProviderCard from '@/components/services/ProviderCard';
import { getServiceCategoryById, getProvidersByServiceId } from '@/lib/services.data';

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const category = getServiceCategoryById(id);
  const providers = getProvidersByServiceId(id);

  const formattedTitle = category
    ? category.title
    : id
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  return (
    <main className="flex-1 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Services</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {formattedTitle} Specialists
          </h1>

          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
            {category?.description || 'Browse certified professionals available for on-demand dispatch.'}
          </p>
        </div>

        {/* Providers Grid */}
        {providers.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              No specific providers listed for this category yet
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Try exploring our other core services or ask our virtual AI advisor for recommendations.
            </p>
            <div className="mt-6">
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Browse All Services
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
