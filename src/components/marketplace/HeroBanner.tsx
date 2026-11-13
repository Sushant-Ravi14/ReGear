'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PlusCircle, ShieldCheck, Zap, RotateCcw } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white shadow-xl my-6">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:px-12">
        <div className="max-w-2xl space-y-6 text-left">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Give Technology a <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-white">
              Second Life.
            </span>
          </h1>

          {/* Description */}
          <p className="text-emerald-100/90 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            Discover quality pre-owned and refurbished electronics at prices you&apos;ll love. Bench-tested, certified, and ready for you.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2">
            <Link
              href="/products"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white text-emerald-950 font-bold text-sm hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>Explore Deals</span>
              <ArrowRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/sell"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600/60 hover:bg-emerald-600/80 text-white font-bold text-sm border border-emerald-400/40 backdrop-blur-sm transition-all shadow-md hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>Start Selling</span>
            </Link>
          </div>

          {/* Trust Points */}
          <div className="pt-4 flex flex-wrap items-center justify-start gap-6 text-xs text-emerald-200/90">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Up to 70% Off Retail</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-emerald-300" />
              <span>7-Day Replacement</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-300" />
              <span>Zero Carbon Footprint</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
