'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, CheckCircle, Clock, Award, Check, MapPin } from 'lucide-react';
import { ServiceProvider } from '@/lib/services.data';

interface ProviderCardProps {
  provider: ServiceProvider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const [isBooked, setIsBooked] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return 'PR';
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleBook = () => {
    setIsBooked(true);
  };

  const displayRate = provider.hourlyRate
    ? provider.hourlyRate.startsWith('$')
      ? provider.hourlyRate
      : `$${provider.hourlyRate}/hr`
    : '$75/hr';

  const ratingVal = typeof provider.rating === 'number' ? provider.rating : 5.0;
  const reviewsCount = typeof provider.reviewCount === 'number' ? provider.reviewCount : 0;
  const experienceText = provider.experience || 'Verified Specialist';
  const availabilityText = provider.availability || 'Available Today';

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div>
        {/* Top Header: Avatar + Status + Rate */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* Initials Avatar with Available Dot */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <span>{getInitials(provider.name)}</span>
              <span
                className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900"
                title={availabilityText}
              />
            </div>

            {/* Name & Title */}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                  {provider.name}
                </h3>
                <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {provider.profession}
              </p>
              {provider.address && (
                <div className="mt-1 flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <MapPin className="h-3 w-3 text-zinc-400 shrink-0" />
                  <span className="truncate max-w-[180px]">{provider.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hourly Rate Pill */}
          <div className="text-right">
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {displayRate}
            </span>
          </div>
        </div>

        {/* Rating & Experience Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-zinc-100 py-3 text-xs text-zinc-600 dark:border-zinc-800/80 dark:text-zinc-400">
          <div className="flex items-center gap-1 font-semibold text-zinc-900 dark:text-zinc-100">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{ratingVal.toFixed(1)}</span>
            <span className="font-normal text-zinc-400">
              ({reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <span>•</span>

          <div className="flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-zinc-400" />
            <span>{experienceText}</span>
          </div>

          <span>•</span>

          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>{availabilityText}</span>
          </div>
        </div>
      </div>

      {/* Booking Action Button */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        {isBooked ? (
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              Request Sent!
            </span>
            <Link
              href="/bookings"
              className="text-emerald-700 underline hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
            >
              View in Bookings
            </Link>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleBook}
            aria-label={`Book service with ${provider.name}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <span>Book Provider</span>
          </button>
        )}
      </div>
    </article>
  );
}
