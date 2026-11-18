'use client';

import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '@/components/ui/EmptyState';

interface ProductGridProps {
  products: any[];
  favorites?: any[];
  onFavoriteToggle?: (isFavorited: boolean) => void;
  columns?: 3 | 4;
}

export default function ProductGrid({
  products = [],
  favorites = [],
  onFavoriteToggle,
  columns = 4,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No devices match your criteria"
        description="Try relaxing your filters, searching for a different brand, or clearing price limits."
      />
    );
  }

  const gridColsClass = {
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  const favoriteIds = new Set(
    favorites.map((f) => (typeof f === 'string' ? f : f.productId?._id || f.productId))
  );

  return (
    <div className={`grid gap-6 ${gridColsClass}`}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          isFavorited={favoriteIds.has(product._id)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
}
