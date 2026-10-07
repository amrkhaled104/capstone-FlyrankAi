import React from 'react';
import Link from 'next/link';

export interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-xl backdrop-blur-md transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900/90 sm:p-8">
        {/* Subtle Decorative Top Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-36 w-64 rounded-full bg-gradient-to-r from-blue-500/20 via-sky-400/20 to-indigo-500/20 blur-2xl dark:from-blue-600/30 dark:via-sky-500/20 dark:to-indigo-600/30"
        />

        {/* Card Header */}
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group mb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
            aria-label="HomeServices AI Home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition-transform group-hover:scale-105 dark:bg-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              HomeServices <span className="text-blue-600 dark:text-blue-400">AI</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </p>
        </div>

        {/* Form Body */}
        {children}

        {/* Card Footer */}
        <div className="mt-6 border-t border-zinc-200/80 pt-5 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <span>{footerText} </span>
          <Link
            href={footerLinkHref}
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm dark:text-blue-400 dark:hover:text-blue-300"
          >
            {footerLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
}
