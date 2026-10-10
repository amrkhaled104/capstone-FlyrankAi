'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ArrowLeft, Users, ShieldCheck } from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  getServiceCategoryById,
  isProfessionMatchingCategory,
  ServiceProvider,
} from '@/lib/services.data';
import ProviderCard from '@/components/services/ProviderCard';

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export default function ServicePage({ params }: ServicePageProps) {
  // Support both React 19 Promise params unwrapping and useParams hook fallback
  const unwrappedParams = React.use(params);
  const routeParams = useParams();
  const categoryId = (unwrappedParams?.id || routeParams?.id || '') as string;

  const category = getServiceCategoryById(categoryId);

  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const formattedTitle = category
    ? category.title
    : categoryId
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  useEffect(() => {
    let isMounted = true;

    async function fetchTechnicians() {
      if (!categoryId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setHasError(false);

      try {
        const usersRef = collection(db, 'users');

        // Query Firestore collection 'users' for technicians where isPublished == true
        let querySnapshot;
        try {
          const q = query(
            usersRef,
            where('role', '==', 'technician'),
            where('isPublished', '==', true)
          );
          querySnapshot = await getDocs(q);
        } catch (queryErr) {
          console.warn('[ServicePage] Direct query fallback:', queryErr);
          try {
            const q = query(usersRef, where('isPublished', '==', true));
            querySnapshot = await getDocs(q);
          } catch {
            const q = query(usersRef, where('role', '==', 'technician'));
            querySnapshot = await getDocs(q);
          }
        }

        const matchedList: ServiceProvider[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();

          // Strictly require isPublished == true
          if (data.isPublished !== true) {
            return;
          }

          // Ensure role is technician or provider
          const userRole = String(data.role || '').toLowerCase();
          if (userRole !== 'technician' && userRole !== 'provider') {
            return;
          }

          const userProfession = data.profession || '';

          // Match condition: profession equals categoryId, category title, or trade alias
          const isMatch =
            userProfession === categoryId ||
            userProfession.toLowerCase() === categoryId.toLowerCase() ||
            isProfessionMatchingCategory(userProfession, categoryId);

          if (isMatch) {
            matchedList.push({
              id: docSnap.id,
              name: data.fullName || 'Verified Technician',
              serviceId: categoryId,
              profession: data.profession || category?.title || 'Specialist',
              rating: typeof data.rating === 'number' ? data.rating : 5.0,
              reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 0,
              hourlyRate: data.hourlyRate
                ? data.hourlyRate.startsWith('$')
                  ? data.hourlyRate
                  : `$${data.hourlyRate}/hr`
                : '$75/hr',
              experience: data.yearsOfExperience
                ? data.yearsOfExperience.toString().includes('year')
                  ? data.yearsOfExperience
                  : `${data.yearsOfExperience} yrs exp`
                : 'Verified Pro',
              availability: data.availability || 'Available Today',
              badges:
                Array.isArray(data.badges) && data.badges.length > 0
                  ? data.badges
                  : ['Verified Pro', 'Background Checked'],
              phone: data.phone || '',
              address: data.address || '',
              bio: data.bio || '',
              email: data.email || '',
              isPublished: true,
            });
          }
        });

        if (isMounted) {
          setProviders(matchedList);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[ServicePage] Error fetching technicians from Firestore:', err);
        if (isMounted) {
          setHasError(true);
          setProviders([]);
          setIsLoading(false);
        }
      }
    }

    fetchTechnicians();

    return () => {
      isMounted = false;
    };
  }, [categoryId, category?.title]);

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
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-200/80 pb-6 dark:border-zinc-800 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Directory
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {formattedTitle} Specialists
            </h1>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
              {category?.description ||
                'Browse certified professionals available for on-demand dispatch.'}
            </p>
          </div>

          {!isLoading && (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{providers.length}</span>{' '}
              {providers.length === 1 ? 'specialist' : 'specialists'}
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div
            className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading verified providers"
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-800/60" />
                  </div>
                </div>
                <div className="mt-6 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800/50" />
                <div className="mt-4 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        )}

        {/* Real Providers Grid */}
        {!isLoading && providers.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}

        {/* Fallback / Empty State UI */}
        {!isLoading && providers.length === 0 && (
          <section
            aria-label="Empty state"
            className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-12"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Users className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
              No verified service providers available in this category yet
            </h2>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              {hasError
                ? 'Unable to connect to the directory service. Please check your connection and try again.'
                : 'We are actively vetting specialists for this trade. Check back soon or explore our other core home maintenance services.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Browse All Services
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 shadow-xs transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                Join as a Technician
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
