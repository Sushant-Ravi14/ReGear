'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Trash2,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastNotifications';
import { formatPrice } from '@/lib/utils';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

interface ModerationItem {
  _id: string;
  title: string;
  brand: string;
  price: number;
  category: string;
  source: string;
}

interface AdminStats {
  success?: boolean;
  recentActivity?: {
    listings?: ModerationItem[];
    [key: string]: any;
  };
  [key: string]: any;
}

export default function AdminDemoPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [secretKey, setSecretKey] = useState('regear_secret_seed_key_2026');
  const [isSeeding, setIsSeeding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ModerationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const loadStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleTriggerSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch(`/api/seed?secret=${encodeURIComponent(secretKey)}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        addToast(data.message, 'success');
        loadStats();
      } else {
        addToast(data.error || 'Seed failed', 'error');
      }
    } catch (err) {
      addToast('Network error triggering seed', 'error');
    } finally {
      setIsSeeding(false);
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
        addToast('Listing moderated & deleted from Database', 'success');
        loadStats();
      } else {
        addToast(data.error || 'Failed to remove listing', 'error');
      }
    } catch (e) {
      addToast('Network error', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            System Moderation & Seed Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Controlled environment to inspect Database models, trigger catalogue synchronization, and moderate active listings.
          </p>
        </div>
      </div>

      {/* Database Seeder Control */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">DummyJSON Catalogue Synchronizer</h3>
            <p className="text-xs text-slate-500">
              Fetch or refresh catalogue products from DummyJSON into Database with idempotent upsert.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Admin Seed Secret"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="button"
            disabled={isSeeding}
            onClick={handleTriggerSeed}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
            <span>{isSeeding ? 'Synchronizing...' : 'Run Idempotent Seed'}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Note: This operation is idempotent and will update/insert DummyJSON sample listings without overwriting user-created listings.
        </p>
      </div>

      {/* Moderation Listing View */}
      {stats?.recentActivity?.listings && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Recent Catalogue Moderation</h3>
            <span className="text-xs font-semibold text-slate-400">
              Latest items in Database
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.recentActivity.listings.map((item) => (
              <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <Link
                    href={`/products/${item._id}`}
                    className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{item.brand}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800">{formatPrice(item.price)}</span>
                    <span>•</span>
                    <span className="capitalize">{item.category}</span>
                    <span>•</span>
                    <span className="text-slate-400">source: {item.source}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/products/${item._id}`}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    title="View Product"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Moderate / Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        title="Admin Moderate: Remove Listing?"
        message={`Are you sure you want to remove "${deleteTarget?.title}" from the marketplace?`}
        confirmLabel="Remove Listing"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
