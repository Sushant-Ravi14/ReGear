'use client';

import { useState, useEffect } from 'react';
import DashboardNav from '@/components/dashboard/DashboardNav';
import StatsOverview, { DashboardStats } from '@/components/dashboard/StatsOverview';
import ActivityList, { RecentActivityData } from '@/components/dashboard/ActivityList';
import EmptyState from '@/components/ui/EmptyState';
import { DEMO_USERS } from '@/lib/demoUser';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface DashboardApiResponse {
  success?: boolean;
  stats?: DashboardStats;
  recentActivity?: RecentActivityData;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500">
              Signed in as: <strong className="text-slate-800">{DEMO_USERS.seller.name}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Seller Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics and activity monitoring aggregated directly from MongoDB.
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

      {/* Tabs */}
      <DashboardNav />

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-3xl border border-slate-100" />
          ))}
        </div>
      ) : data?.stats ? (
        <>
          <StatsOverview stats={data.stats} />
          <ActivityList recentActivity={data.recentActivity || null} />
        </>
      ) : (
        <EmptyState
          title="Could not load statistics"
          description="Ensure MongoDB is connected and seeded with catalogue data."
        />
      )}
    </div>
  );
}
