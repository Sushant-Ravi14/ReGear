'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ConditionBadge from './ConditionBadge';
import PriceDisplay from './PriceDisplay';
import FavoriteButton from './FavoriteButton';
import { MapPin } from 'lucide-react';

export interface ProductItem {
  _id: string;
  title: string;
  brand?: string;
  model?: string;
  price: number;
  originalPrice?: number;
  condition: string;
  category?: string;
  images?: string[];
  location?: string;
  status: string;
  source?: string;
  createdAt?: string | Date;
  [key: string]: any;
}

export interface ProductCardProps {
  product: ProductItem;
  isFavorited?: boolean;
  onFavoriteToggle?: (isFavorited: boolean) => void;
}

export default function ProductCard({
  product,
  isFavorited = false,
  onFavoriteToggle,
}: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(
    product.images && product.images[0]
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
  );

  const isAvailable = product.status === 'Available';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-0.5">
      {/* Card Header & Badges */}
      <div className="relative w-full pt-[75%] bg-slate-50 overflow-hidden">
        <Link href={`/products/${product._id}`} className="absolute inset-0 block">
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            onError={() =>
              setImgSrc(
                'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
              )
            }
          />
        </Link>

        {/* Favorite Heart Button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <FavoriteButton
            productId={product._id}
            initialFavorited={isFavorited}
            onToggle={onFavoriteToggle}
          />
        </div>

        {/* Status Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          <ConditionBadge condition={product.condition} />
          {!isAvailable && (
            <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
              {product.status}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand & Model */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider truncate">
              {product.brand || 'Unspecified'}
            </span>
            {product.location && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                <MapPin className="w-3 h-3" />
                {product.location}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link
            href={`/products/${product._id}`}
            className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-brand-600 transition-colors"
            title={product.title}
          >
            {product.title}
          </Link>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            size="md"
          />

          <Link
            href={`/products/${product._id}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-700 transition-all shrink-0"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
