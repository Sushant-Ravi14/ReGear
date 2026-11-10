import React from 'react';
import Link from 'next/link';
import { PackageOpen, RotateCcw, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  icon?: LucideIcon;
}

export default function EmptyState({
  title = 'No products found',
  description = 'Try adjusting your search query, clearing active filters, or check back later.',
  actionLabel = 'Reset All Filters',
  onAction,
  actionHref,
  icon: Icon = PackageOpen,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm my-8">
      <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-100">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-6 leading-relaxed">{description}</p>
      {actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          {actionLabel}
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
