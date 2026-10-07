import React from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-950 transition-colors">
      {/* Distraction-free Minimal Top Bar (Brand & Theme Switcher) */}
      <header className="w-full flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-800 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400 transition-colors"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs dark:bg-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <span>
            HomeServices <span className="text-blue-600 dark:text-blue-400">AI</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Clean Centered Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        {children}
      </main>

      {/* Subtle Footer */}
      <footer className="py-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
        © {new Date().getFullYear()} HomeServices AI. All rights reserved.
      </footer>
    </div>
  );
}
