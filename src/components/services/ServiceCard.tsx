import React from 'react';
import Link from 'next/link';
import { Wrench, Zap, Wind, Tv, Sparkles, ArrowRight } from 'lucide-react';
import { ServiceCategory } from '@/lib/services.data';

interface ServiceCardProps {
  category: ServiceCategory;
}

const ICON_MAP = {
  Wrench: <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  Zap: <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
  Wind: <Wind className="h-6 w-6 text-sky-600 dark:text-sky-400" />,
  Tv: <Tv className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
  Sparkles: <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
};

const ICON_BG_MAP = {
  Wrench: 'bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-900/40',
  Zap: 'bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40',
  Wind: 'bg-sky-50 dark:bg-sky-950/60 border-sky-100 dark:border-sky-900/40',
  Tv: 'bg-purple-50 dark:bg-purple-950/60 border-purple-100 dark:border-purple-900/40',
  Sparkles: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40',
};

export default function ServiceCard({ category }: ServiceCardProps) {
  const icon = ICON_MAP[category.iconName] || <Wrench className="h-6 w-6 text-blue-600" />;
  const iconBg = ICON_BG_MAP[category.iconName] || 'bg-blue-50 border-blue-100';

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div>
        {/* Header: Icon & Starting Price */}
        <div className="flex items-center justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 ${iconBg}`}
          >
            {icon}
          </div>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            From {category.startingPrice}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-lg font-bold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
          {category.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {category.description}
        </p>
      </div>

      {/* Action Link */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <Link
          href={`/services/${category.id}`}
          className="inline-flex w-full items-center justify-between rounded-xl bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-zinc-800 transition-all hover:bg-blue-600 hover:text-white dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:bg-blue-600 dark:hover:text-white"
        >
          <span>View Available Providers</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
