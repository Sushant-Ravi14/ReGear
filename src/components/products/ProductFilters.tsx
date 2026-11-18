'use client';

import React from 'react';
import { CATEGORIES, CONDITIONS } from '@/constants/categories';
import { Filter, RotateCcw, Check } from 'lucide-react';

export interface FilterState {
  search?: string;
  category?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  condition?: string;
  status?: string;
  brand?: string;
  sort?: string;
  page?: number;
  [key: string]: any;
}

export interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (key: string, value: any) => void;
  onResetFilters: () => void;
  brands?: string[];
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export default function ProductFilters({
  filters,
  onFilterChange,
  onResetFilters,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: ProductFiltersProps) {
  const handleCategorySelect = (categorySlug: string) => {
    const selected = CATEGORIES.find((c) => c.slug === categorySlug);
    const categoryLabel = selected ? selected.label : '';
    onFilterChange('category', categorySlug === 'all' ? '' : categoryLabel);
  };

  const handleConditionToggle = (cond: string) => {
    const currentConditions = filters.condition ? filters.condition.split(',').filter(Boolean) : [];
    let updated: string[];
    if (currentConditions.includes(cond)) {
      updated = currentConditions.filter((c) => c !== cond);
    } else {
      updated = [...currentConditions, cond];
    }
    onFilterChange('condition', updated.join(','));
  };

  const selectedConditions = filters.condition ? filters.condition.split(',').filter(Boolean) : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Filter className="w-5 h-5 text-brand-600" />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Category
        </h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected =
              (!filters.category && cat.slug === 'all') ||
              (filters.category && filters.category.toLowerCase() === cat.label.toLowerCase());

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200/60'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="w-4 h-4 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Price Range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Min (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Max (₹)</label>
            <input
              type="number"
              placeholder="1,00,000"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Condition Checkboxes */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Condition
        </h4>
        <div className="space-y-2">
          {CONDITIONS.map((cond) => {
            const isChecked = selectedConditions.includes(cond);
            return (
              <label
                key={cond}
                className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleConditionToggle(cond)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 focus:ring-offset-0"
                />
                <span>{cond}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Availability
        </h4>
        <div className="space-y-2">
          {['Available', 'all'].map((statusKey) => (
            <label
              key={statusKey}
              className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none"
            >
              <input
                type="radio"
                name="availability"
                checked={
                  statusKey === 'all'
                    ? filters.status === 'all'
                    : (!filters.status || filters.status === 'Available')
                }
                onChange={() => onFilterChange('status', statusKey === 'all' ? 'all' : 'Available')}
                className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500"
              />
              <span>{statusKey === 'all' ? 'Show All (Including Sold)' : 'In Stock Only'}</span>
            </label>
          ))}
        </div>
      </div>

      {isMobileDrawer && (
        <button
          type="button"
          onClick={onCloseMobileDrawer}
          className="w-full mt-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-sm"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
}
