import React from 'react';
import { formatPrice, calculateDiscount } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
}

export default function PriceDisplay({
  price,
  originalPrice = 0,
  size = 'md',
  showDiscount = true,
}: PriceDisplayProps) {
  const discount = calculateDiscount(price, originalPrice);

  const priceSizes = {
    sm: 'text-base font-bold text-slate-900',
    md: 'text-xl font-bold text-slate-900',
    lg: 'text-3xl font-extrabold text-slate-900',
  };

  const origSizes = {
    sm: 'text-xs text-slate-400 line-through',
    md: 'text-sm text-slate-400 line-through',
    lg: 'text-base text-slate-400 line-through',
  };

  return (
    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
      <span className={priceSizes[size] || priceSizes.md}>
        {formatPrice(price)}
      </span>
      {originalPrice > price && (
        <>
          <span className={origSizes[size] || origSizes.md}>
            {formatPrice(originalPrice)}
          </span>
          {showDiscount && discount > 0 && (
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              {discount}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
}
