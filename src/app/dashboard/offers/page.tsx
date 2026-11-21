'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardNav from '@/components/dashboard/DashboardNav';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastNotifications';
import {
  Tag,
  Clock,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';
import { DEMO_USERS } from '@/lib/demoUser';

interface OfferRecord {
  _id: string;
  offeredPrice: number;
  originalPrice: number;
  buyerName: string;
  buyerEmail: string;
  message?: string;
  status: string;
  createdAt: string | Date;
  productId?: {
    _id: string;
    title: string;
  };
}

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { addToast } = useToast();

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/offers?sellerId=${DEMO_USERS.seller._id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOffers(data.data);
      }
    } catch (err) {
      addToast('Failed to load offers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleUpdateStatus = async (offerId: string, newStatus: string) => {
    setUpdatingId(offerId);
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setOffers((prev) =>
          prev.map((o) => (o._id === offerId ? data.data : o))
        );
        addToast(`Offer has been ${newStatus.toLowerCase()}`, 'success');
      } else {
        addToast(data.error || 'Failed to update offer status', 'error');
      }
    } catch (err) {
      addToast('Network error updating offer', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Incoming Price Offers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Accept or reject counter-offers submitted by interested buyers.
          </p>
        </div>
      </div>

      <DashboardNav />

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100" />
          ))}
        </div>
      ) : offers.length > 0 ? (
        <div className="space-y-4">
          {offers.map((offer) => {
            const product = offer.productId;
            const isPending = offer.status === 'Pending';
            const isUpdating = updatingId === offer._id;

            return (
              <div
                key={offer._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                {/* Left Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        offer.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : offer.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {offer.status}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(offer.createdAt)}
                    </span>
                  </div>

                  <div>
                    {product && (
                      <Link
                        href={`/products/${product._id}`}
                        className="font-bold text-slate-900 text-base hover:text-brand-600 line-clamp-1 transition-colors flex items-center gap-1"
                      >
                        <span>{product.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    )}
                    <p className="text-xs text-slate-500 mt-0.5">
                      From: <strong className="text-slate-800">{offer.buyerName}</strong> ({offer.buyerEmail})
                    </p>
                  </div>

                  {offer.message && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-lg">
                      &quot;{offer.message}&quot;
                    </p>
                  )}
                </div>

                {/* Right: Amounts & Accept/Reject Buttons */}
                <div className="flex flex-col sm:items-end gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Offered Amount
                    </p>
                    <div className="flex items-baseline sm:justify-end gap-2">
                      <span className="text-2xl font-black text-brand-700">
                        {formatPrice(offer.offeredPrice)}
                      </span>
                      {offer.originalPrice > 0 && (
                        <span className="text-xs text-slate-400 line-through">
                          List: {formatPrice(offer.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(offer._id, 'Accepted')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Offer</span>
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(offer._id, 'Rejected')}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-xs border border-slate-200 transition-all flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No price offers received"
          description="Buyers can propose custom offer amounts on your product pages. Any proposals will appear here."
          icon={Tag}
        />
      )}
    </div>
  );
}
