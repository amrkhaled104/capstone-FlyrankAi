'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { ShieldCheck, Mail, LogOut, Loader2, Sparkles, UserCheck } from 'lucide-react';
import { auth } from '@/lib/firebase';

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50/50 p-4 dark:bg-zinc-950 sm:p-6">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl backdrop-blur-md transition-all dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm dark:bg-blue-500">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                HomeServices AI
              </h2>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Dashboard Overview
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Session
          </span>
        </div>

        {/* Welcome Section */}
        <div className="mt-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <UserCheck className="h-7 w-7" />
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {isLoadingAuth ? (
              'Loading session...'
            ) : currentUser?.displayName ? (
              `Welcome, Engineer ${currentUser.displayName}!`
            ) : currentUser?.email ? (
              `Welcome, Engineer ${currentUser.email.split('@')[0]}!`
            ) : (
              'Welcome, Engineer!'
            )}
          </h1>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            You are successfully authenticated and ready to manage on-demand home service operations.
          </p>
        </div>

        {/* User Identity Card */}
        <div className="mt-6 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Authenticated Identity
          </span>

          {isLoadingAuth ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span>Fetching identity from Firebase...</span>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  Email:
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {currentUser?.email || 'Guest User'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <ShieldCheck className="h-4 w-4 text-zinc-400" />
                  Firebase UID:
                </span>
                <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {currentUser?.uid ? `${currentUser.uid.slice(0, 14)}...` : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 pt-2">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white py-2.5 px-4 text-sm font-semibold text-zinc-700 shadow-2xs transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-red-800 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </main>
  );
}
