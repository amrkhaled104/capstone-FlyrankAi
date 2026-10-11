import React from 'react';
import type { Metadata } from 'next';
import { Calendar, Inbox } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Bookings - HomeServices AI',
  description: 'View and manage your scheduled home service appointments.',
};

export default function BookingsPage() {
  return (
    <main className="flex-1 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                Bookings
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                View and track your scheduled home service appointments.
              </p>
            </div>
          </div>
        </div>

        {/* Clean Empty State (No Fake Buttons) */}
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
          <Inbox className="mx-auto h-9 w-9 text-zinc-400 dark:text-zinc-500" />
          <h2 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            No bookings found
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Your upcoming service appointments and booking history will appear here once confirmed.
          </p>
        </div>
      </div>
    </main>
  );
}
