import { formatPrice } from '@/lib/utils';
import {
  ShoppingBag,
  CheckCircle,
  MessageSquare,
  Tag,
  TrendingUp,
  LucideIcon,
} from 'lucide-react';

export interface DashboardStats {
  activeListings?: number;
  totalListings?: number;
  soldListings?: number;
  reservedListings?: number;
  pendingEnquiries?: number;
  pendingOffers?: number;
  totalValue?: number;
}

interface StatsOverviewProps {
  stats: DashboardStats | null;
}

interface StatCard {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  color: string;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) return null;

  const statCards: StatCard[] = [
    {
      label: 'Active Listings',
      value: stats.activeListings || 0,
      subtext: `${stats.totalListings || 0} total listings`,
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      label: 'Sold Devices',
      value: stats.soldListings || 0,
      subtext: `${stats.reservedListings || 0} reserved`,
      icon: CheckCircle,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
    },
    {
      label: 'Pending Enquiries',
      value: stats.pendingEnquiries || 0,
      subtext: 'Awaiting your reply',
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      label: 'Pending Offers',
      value: stats.pendingOffers || 0,
      subtext: 'Price proposals to review',
      icon: Tag,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      label: 'Active Inventory Value',
      value: formatPrice(stats.totalValue || 0),
      subtext: 'Cumulative listing worth',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {statCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                {card.value}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
