'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/categories/cleaning', label: 'Categories' },
  { href: '/bookings', label: 'Bookings' },
  { href: '/ai-advisor', label: 'AI Advisor' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href.startsWith('/categories')) {
      return pathname.startsWith('/categories');
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm dark:bg-blue-500">
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
            <span>HomeServices AI</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex md:items-center md:gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search Bar & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Search Bar (Visual Placeholder) */}
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="hidden sm:flex sm:items-center"
          >
            <label htmlFor="navbar-search" className="sr-only">
              Search services
            </label>
            <div className="relative">
              <input
                id="navbar-search"
                type="search"
                placeholder="Search services..."
                className="h-9 w-48 rounded-lg border border-zinc-300 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-blue-400 dark:focus:bg-zinc-950 lg:w-64"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <button
              type="submit"
              aria-label="Search"
              className="ml-2 inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Search
            </button>
          </form>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 md:hidden"
          >
            {mobileMenuOpen ? (
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
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
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800 md:hidden">
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mb-3 flex items-center"
          >
            <label htmlFor="navbar-search-mobile" className="sr-only">
              Search services
            </label>
            <div className="relative flex-1">
              <input
                id="navbar-search-mobile"
                type="search"
                placeholder="Search services..."
                className="h-9 w-full rounded-lg border border-zinc-300 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <button
              type="submit"
              aria-label="Search"
              className="ml-2 inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Search
            </button>
          </form>
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
