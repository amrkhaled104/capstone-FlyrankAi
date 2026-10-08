import React from 'react';
import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';

export const metadata: Metadata = {
  title: 'HomeServices AI - AI-Powered Home Maintenance',
  description:
    'Instant AI diagnostics for electrical, plumbing, and HVAC issues. Match with certified local trade specialists with upfront transparent pricing.',
};

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col justify-center">
      <HeroSection />
    </main>
  );
}
