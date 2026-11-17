import React from 'react';
import { CONDITION_DETAILS } from '@/constants/categories';

interface ConditionBadgeProps {
  condition?: string;
  className?: string;
}

export default function ConditionBadge({ condition = 'Good', className = '' }: ConditionBadgeProps) {
  const details = CONDITION_DETAILS[condition] || {
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Pre-owned tech device bench-tested and operational.',
  };

  return (
    <span
      title={details.description}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${details.badgeClass} ${className}`}
    >
      {condition}
    </span>
  );
}
