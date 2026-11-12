'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';

interface CategoryNavProps {
  activeCategory?: string;
  onSelectCategory?: (slug: string) => void;
}

export default function CategoryNav({ activeCategory = 'all', onSelectCategory }: CategoryNavProps) {
  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Explore by Category</span>
        </h2>
        <Link
          href="/products"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Horizontal Scrollable Category Strip - clean text buttons without icons */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive =
            activeCategory.toLowerCase() === cat.slug.toLowerCase() ||
            activeCategory.toLowerCase() === cat.label.toLowerCase();

          const href = cat.slug === 'all' ? '/products' : `/categories/${cat.slug}`;

          if (onSelectCategory) {
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all border ${
                  isActive
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={cat.id}
              href={href}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all border ${
                isActive
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                  : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <span>{cat.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
