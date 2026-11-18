'use client';

import React from 'react';
import { SORT_OPTIONS } from '@/constants/categories';
import { ArrowUpDown } from 'lucide-react';

interface SortDropdownProps {
  value?: string;
  onChange: (val: string) => void;
}

export default function SortDropdown({ value = 'newest', onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        <ArrowUpDown className="w-3.5 h-3.5" />
        Sort:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-xl shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-brand-500 cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
