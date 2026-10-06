'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/lib/validators/auth.schema';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const profile = docSnap.data() as UserProfile;
          setRole(profile.role);
        } else {
          setRole('customer');
        }
      } catch {
        setRole('customer');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <p className="text-sm text-zinc-500">Loading...</p>
      </main>
    );
  }

  // Display admin if technician, or user if customer
  const roleDisplay = role === 'technician' ? 'admin' : 'user';

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        I am {roleDisplay}
      </p>

      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Sign Out
      </button>
    </main>
  );
}
