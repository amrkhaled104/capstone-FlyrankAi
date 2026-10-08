"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";

export default function HeroSection() {
  const handleOpenChat = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-chat-widget"));
    }
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Background Ambience Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      >
        <div className="h-[450px] w-[600px] rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-600/15 sm:w-[800px]" />
        <div className="absolute -top-24 right-1/4 h-[350px] w-[450px] rounded-full bg-indigo-500/10 blur-[110px] dark:bg-indigo-600/10" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-left">
          {/* Main Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl md:text-6xl lg:leading-[1.12]">
            Smart Home Repairs,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-sky-400">
              Powered by AI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg lg:text-xl">
            Diagnose plumbing leaks, electrical trips, and HVAC issues in
            seconds with our virtual AI advisor. Get matched with verified,
            background-checked trade professionals with upfront pricing and zero
            hidden fees.
          </p>

          {/* Primary & Secondary Call To Actions */}
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-zinc-950"
            >
              <span>Explore Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={handleOpenChat}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-zinc-800 shadow-2xs backdrop-blur-sm transition-all hover:border-blue-300 hover:bg-zinc-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-850 dark:hover:text-blue-400"
            >
              <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Start AI Diagnostic</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
