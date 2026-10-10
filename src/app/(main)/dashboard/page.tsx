'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Wrench,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Star,
  DollarSign,
  TrendingUp,
  Inbox,
  History,
  RotateCcw,
  LogOut,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { signOutFromFirebase } from '@/lib/auth.service';
import { UserRole } from '@/lib/validators/auth.schema';
import {
  CustomerBooking,
  ProviderRequest,
  INITIAL_CUSTOMER_ACTIVE_BOOKINGS,
  INITIAL_CUSTOMER_PAST_BOOKINGS,
  INITIAL_PROVIDER_REQUESTS,
  INITIAL_PROVIDER_COMPLETED_JOBS,
} from '@/lib/dashboard.data';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('customer');
  const [userName, setUserName] = useState<string>('Amr');

  // Customer activity state
  const [activeBookings, setActiveBookings] = useState<CustomerBooking[]>(
    INITIAL_CUSTOMER_ACTIVE_BOOKINGS
  );
  const [pastBookings, setPastBookings] = useState<CustomerBooking[]>(
    INITIAL_CUSTOMER_PAST_BOOKINGS
  );

  // Provider activity state
  const [incomingRequests, setIncomingRequests] = useState<ProviderRequest[]>(
    INITIAL_PROVIDER_REQUESTS
  );
  const [completedJobs] = useState(INITIAL_PROVIDER_COMPLETED_JOBS);

  // Feedback notifications
  const [notification, setNotification] = useState<string | null>(null);

  // Dynamic role detection from Firebase Auth & Cloud Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.displayName) {
          setUserName(user.displayName.split(' ')[0] || user.displayName);
        }
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const detectedRole = (data.role as UserRole) || 'customer';
            setRole(detectedRole);
            if (data.fullName) {
              setUserName(data.fullName.split(' ')[0]);
            }
          }
        } catch (err) {
          console.warn('[Dashboard] Could not fetch role from Firestore:', err);
        }
      } else {
        if (typeof window !== 'undefined') {
          const savedRole = localStorage.getItem('user_role') as UserRole | null;
          if (savedRole) {
            setRole(savedRole);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('logged_out', 'true');
      }
      await signOutFromFirebase();
      router.push('/login');
    } catch (err) {
      console.error('[Dashboard] Sign out error:', err);
    }
  };

  // Provider Actions
  const handleAcceptRequest = (reqId: string) => {
    const target = incomingRequests.find((r) => r.id === reqId);
    if (!target) return;

    setIncomingRequests((prev) => prev.filter((r) => r.id !== reqId));
    showNotification(`Accepted request from ${target.customerName} (${target.serviceTitle}).`);
  };

  const handleDeclineRequest = (reqId: string) => {
    const target = incomingRequests.find((r) => r.id === reqId);
    if (!target) return;

    setIncomingRequests((prev) => prev.filter((r) => r.id !== reqId));
    showNotification(`Declined service request from ${target.customerName}.`);
  };

  // Customer Actions
  const handleCancelBooking = (bookingId: string) => {
    const target = activeBookings.find((b) => b.id === bookingId);
    if (!target) return;

    setActiveBookings((prev) => prev.filter((b) => b.id !== bookingId));
    setPastBookings((prev) => [
      {
        ...target,
        status: 'cancelled',
      },
      ...prev,
    ]);
    showNotification(`Booking "${target.serviceTitle}" has been cancelled.`);
  };

  const isProvider = role === 'technician' || (role as string) === 'provider';

  return (
    <main className="flex-1 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {notification && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/90 p-4 text-sm text-blue-900 shadow-sm transition-all dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <p className="font-medium">{notification}</p>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-xs font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Top Header (Clean, dynamic, no manual UI role tabs) */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-zinc-200/80 pb-6 dark:border-zinc-800 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                {userName}&apos;s Dashboard
              </h1>
              {/* Dynamic Role Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                {isProvider ? (
                  <>
                    <Wrench className="h-3 w-3" />
                    <span>Technician Hub</span>
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3" />
                    <span>Customer Hub</span>
                  </>
                )}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {isProvider
                ? 'Review client inquiries, approve upcoming bookings, and track your completed jobs.'
                : 'Track your scheduled home appointments, view diagnostics, and inspect booking history.'}
            </p>
          </div>

          {/* Header Action: Sign Out */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 shadow-2xs transition hover:bg-rose-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dynamic Metric Summary Cards (Strictly role-specific) */}
        <section aria-label="Activity Metrics" className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {!isProvider ? (
            <>
              {/* Customer Metric 1 */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Active Bookings</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {activeBookings.length}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {activeBookings.length > 0 ? 'Upcoming service scheduled' : 'No pending services'}
                </p>
              </div>

              {/* Customer Metric 2 */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Completed Repairs</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {pastBookings.filter((b) => b.status === 'completed').length}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Verified home repairs</p>
              </div>

              {/* Customer Metric 3 */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Invested</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">$195.00</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Across past repairs</p>
              </div>

              {/* Customer Metric 4 */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Next Service</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {activeBookings.length > 0 ? `${activeBookings[0].scheduledDate}, ${activeBookings[0].scheduledTime}` : 'None'}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {activeBookings.length > 0 ? activeBookings[0].category : 'Schedule anytime'}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Provider Metric 1 */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Incoming Inquiries</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <Inbox className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {incomingRequests.length}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Awaiting your approval</p>
              </div>

              {/* Provider Metric 2 */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Completed Jobs</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {completedJobs.length}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">100% on-time completion</p>
              </div>

              {/* Provider Metric 3 */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Gross Earnings</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">$700.00</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Disbursed to bank account</p>
              </div>

              {/* Provider Metric 4 */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Client Rating</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">4.97 ★</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Based on 142 client reviews</p>
              </div>
            </>
          )}
        </section>

        {/* MAIN BODY: STRICTLY ROLE-SPECIFIC CONTENT */}
        {!isProvider ? (
          /* ================================= CUSTOMER VIEW ONLY ================================= */
          <div className="mt-10 space-y-10">
            {/* 1. Active Bookings Section */}
            <section aria-labelledby="active-bookings-heading">
              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 id="active-bookings-heading" className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Active & Scheduled Bookings
                  </h2>
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span>Book New Service</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {activeBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                    <Inbox className="mx-auto h-8 w-8 text-zinc-400" />
                    <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      No active bookings at the moment
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Browse verified local providers to book your next repair.
                    </p>
                    <Link
                      href="/services"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      <span>Explore Services</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  activeBookings.map((booking) => (
                    <article
                      key={booking.id}
                      className="flex flex-col justify-between gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              booking.status === 'in-progress'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            {booking.status === 'in-progress' ? '● In Progress' : 'Confirmed'}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {booking.category}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {booking.serviceTitle}
                        </h3>

                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-600 dark:text-zinc-400">
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="font-medium text-zinc-900 dark:text-zinc-200">
                              {booking.providerName}
                            </span>
                            <span className="text-zinc-400">({booking.providerRole})</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-zinc-400" />
                            <span>
                              {booking.scheduledDate} at {booking.scheduledTime}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="truncate max-w-[200px]">{booking.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action and Rate */}
                      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-zinc-100 pt-3 dark:border-zinc-800 sm:border-t-0 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">Rate</p>
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {booking.price}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750"
                          >
                            Cancel
                          </button>
                          <Link
                            href="/chat"
                            className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                          >
                            AI Assist
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            {/* 2. Past Bookings / History Section */}
            <section aria-labelledby="past-bookings-heading">
              <div className="flex items-center gap-2 border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
                <History className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                <h2 id="past-bookings-heading" className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Past Service History
                </h2>
              </div>

              <div className="mt-6 space-y-3">
                {pastBookings.map((booking) => (
                  <article
                    key={booking.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-zinc-200/90 bg-white p-4.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            booking.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                        >
                          {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {booking.category}
                        </span>
                      </div>

                      <h3 className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {booking.serviceTitle}
                      </h3>

                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        Performed by <span className="font-medium text-zinc-700 dark:text-zinc-300">{booking.providerName}</span> on {booking.scheduledDate}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Paid</p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {booking.price}
                        </p>
                      </div>

                      {booking.rating && (
                        <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{booking.rating.toFixed(1)}</span>
                        </div>
                      )}

                      <Link
                        href="/services"
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Book Again</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* ================================= PROVIDER VIEW ONLY ================================= */
          <div className="mt-10 space-y-10">
            {/* 1. Incoming Service Requests Section */}
            <section aria-labelledby="incoming-requests-heading">
              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 id="incoming-requests-heading" className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Incoming Service Requests
                  </h2>
                  <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                    {incomingRequests.length} Pending
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {incomingRequests.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                    <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      All caught up! No pending requests.
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      New customer repair requests will appear here in real-time.
                    </p>
                  </div>
                ) : (
                  incomingRequests.map((req) => (
                    <article
                      key={req.id}
                      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        {/* Left Details */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                req.urgency === 'urgent'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                  : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                              }`}
                            >
                              {req.urgency === 'urgent' ? '⚠️ Urgent Request' : 'Standard'}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {req.category}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                            {req.serviceTitle}
                          </h3>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-600 dark:text-zinc-400">
                            <div className="flex items-center gap-1 font-medium text-zinc-900 dark:text-zinc-200">
                              <User className="h-3.5 w-3.5 text-zinc-400" />
                              <span>{req.customerName}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-zinc-400" />
                              <span>
                                {req.requestedDate} • {req.requestedTime}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                              <span>
                                {req.address} ({req.distance})
                              </span>
                            </div>
                          </div>

                          {/* Customer note / problem description */}
                          {req.notes && (
                            <div className="mt-2 rounded-xl bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
                              <span className="font-semibold text-zinc-700 dark:text-zinc-200">Issue Notes: </span>
                              {req.notes}
                            </div>
                          )}
                        </div>

                        {/* Right: Payout and Action Buttons */}
                        <div className="flex flex-col items-start gap-3 sm:items-end sm:shrink-0">
                          <div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Est. Payout</p>
                            <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                              {req.estimatedPayout}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeclineRequest(req.id)}
                              className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750"
                            >
                              <XCircle className="h-3.5 w-3.5 text-zinc-400" />
                              <span>Decline</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAcceptRequest(req.id)}
                              className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Accept Request</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            {/* 2. Provider Booking History / Completed Jobs Section */}
            <section aria-labelledby="provider-history-heading">
              <div className="flex items-center gap-2 border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
                <History className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                <h2 id="provider-history-heading" className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Completed Jobs & Booking History
                </h2>
              </div>

              <div className="mt-6 space-y-3">
                {completedJobs.map((job) => (
                  <article
                    key={job.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-zinc-200/90 bg-white p-4.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Paid & Completed
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {job.completedDate}
                        </span>
                      </div>

                      <h3 className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {job.serviceTitle}
                      </h3>

                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        Client: <span className="font-medium text-zinc-700 dark:text-zinc-300">{job.customerName}</span>
                        {job.review && (
                          <span className="italic text-zinc-600 dark:text-zinc-400"> — &ldquo;{job.review}&rdquo;</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Disbursed Payout</p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {job.payout}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{job.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
