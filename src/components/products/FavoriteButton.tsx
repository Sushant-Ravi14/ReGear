'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useToast } from '@/components/ui/ToastNotifications';

interface FavoriteButtonProps {
  productId: string;
  initialFavorited?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onToggle?: (isFavorited: boolean) => void;
}

export default function FavoriteButton({
  productId,
  initialFavorited = false,
  className = '',
  size = 'md',
  onToggle,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    const newStatus = !isFavorited;
    setIsFavorited(newStatus);

    try {
      if (newStatus) {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
        const data = await res.json();
        if (data.success) {
          addToast('Saved to your favorites', 'success');
          if (onToggle) onToggle(true);
        } else {
          setIsFavorited(false);
          addToast(data.error || 'Failed to add to favorites', 'error');
        }
      } else {
        const res = await fetch(`/api/favorites/${productId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success) {
          addToast('Removed from favorites', 'info');
          if (onToggle) onToggle(false);
        } else {
          setIsFavorited(true);
          addToast(data.error || 'Failed to remove from favorites', 'error');
        }
      }
    } catch (err) {
      setIsFavorited(!newStatus);
      addToast('Network error updating favorites', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const btnPadding = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className={`rounded-full transition-all flex items-center justify-center ${btnPadding[size]} ${
        isFavorited
          ? 'bg-rose-50 text-rose-500 hover:bg-rose-100 shadow-sm'
          : 'bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700 backdrop-blur-sm shadow-sm'
      } ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform active:scale-125 ${
          isFavorited ? 'fill-rose-500 text-rose-500' : ''
        }`}
      />
    </button>
  );
}
