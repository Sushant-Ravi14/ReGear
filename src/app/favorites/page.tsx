'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard, { ProductItem } from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useToast } from '@/components/ui/ToastNotifications';

interface FavoriteRecord {
  _id: string;
  productId: ProductItem;
  userId: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setFavorites(data.data);
      }
    } catch (err) {
      addToast('Failed to load saved favorites', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleFavoriteToggle = (productId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      setFavorites((prev) => prev.filter((f) => f.productId?._id !== productId));
    }
  };

  const products = favorites
    .map((f) => f.productId)
    .filter((p): p is ProductItem => p !== null && typeof p === 'object');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <Heart className="w-7 h-7 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Your Saved Tech
              </h1>
            </div>
          </div>

          <Link
            href="/products"
            className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 self-start md:self-center"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Discover More</span>
          </Link>
        </div>
      </div>

      {/* Grid or Empty State */}
      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isFavorited={true}
              onFavoriteToggle={(newStatus) => handleFavoriteToggle(product._id, newStatus)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved favorites yet"
          description="Browse smartphones, laptops, and audio gear, and click the heart icon on any card to save it for later."
          actionLabel="Explore Deals"
          actionHref="/products"
          icon={Heart}
        />
      )}
    </div>
  );
}
