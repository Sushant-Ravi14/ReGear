'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardNav from '@/components/dashboard/DashboardNav';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import EmptyState from '@/components/ui/EmptyState';
import ConditionBadge from '@/components/products/ConditionBadge';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastNotifications';
import {
  Edit,
  Trash2,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import { DEMO_USERS } from '@/lib/demoUser';
import { ProductItem } from '@/components/products/ProductCard';

export default function MyListingsPage() {
  const [listings, setListings] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const loadListings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products?sellerId=${DEMO_USERS.seller._id}&status=all&limit=50`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setListings(data.data);
      }
    } catch (err) {
      addToast('Failed to load listings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleStatusToggle = async (productId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Available' ? 'Sold' : 'Available';

    try {
      const res = await fetch(`/api/products/${productId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setListings((prev) =>
          prev.map((item) =>
            item._id === productId ? { ...item, status: nextStatus } : item
          )
        );
        addToast(`Product marked as ${nextStatus}`, 'success');
      } else {
        addToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      addToast('Network error updating status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setListings((prev) => prev.filter((item) => item._id !== deleteTarget._id));
        addToast('Listing deleted successfully', 'success');
      } else {
        addToast(data.error || 'Failed to delete listing', 'error');
      }
    } catch (err) {
      addToast('Network error deleting listing', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Product Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage, edit, or adjust availability statuses for your marketplace items.
          </p>
        </div>

        <Link
          href="/sell"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm self-start md:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Device</span>
        </Link>
      </div>

      <DashboardNav />

      {/* Listings Table / Cards */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-3xl border border-slate-100" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {listings.map((item) => {
              const isAvailable = item.status === 'Available';
              const img = item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80';

              return (
                <div
                  key={item._id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  {/* Left: Image & Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden shrink-0">
                      <Image
                        src={img}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ConditionBadge condition={item.condition} />
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <Link
                        href={`/products/${item._id}`}
                        className="font-bold text-slate-900 text-sm sm:text-base hover:text-brand-600 line-clamp-1 transition-colors"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-extrabold text-slate-900">
                          {formatPrice(item.price)}
                        </span>
                        <span>•</span>
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Mark Sold/Available */}
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(item._id, item.status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isAvailable
                          ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          : 'border-slate-200 text-slate-600 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {isAvailable ? 'Mark as Sold' : 'Relist as Available'}
                    </button>

                    {/* View Details */}
                    <Link
                      href={`/products/${item._id}`}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="View Public Listing"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/sell/edit/${item._id}`}
                      className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                      title="Edit Listing"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No listings published yet"
          description="You haven't posted any devices yet. Turn your unused tech into cash today!"
          actionLabel="Create First Listing"
          actionHref="/sell"
        />
      )}

      {/* Confirmation Dialog for Deletion */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Product Listing?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This will permanently remove the device and its active buyer enquiries from MongoDB.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
