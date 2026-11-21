'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Inbox,
  Tag,
  PlusCircle,
  LucideIcon,
} from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export default function DashboardNav() {
  const pathname = usePathname();

  const links: NavLink[] = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/dashboard/listings',
      label: 'My Listings',
      icon: ShoppingBag,
    },
    {
      href: '/dashboard/enquiries',
      label: 'Enquiries',
      icon: Inbox,
    },
    {
      href: '/dashboard/offers',
      label: 'Offers',
      icon: Tag,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Quick Action: New Listing */}
      <Link
        href="/sell"
        className="shrink-0 w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all"
      >
        <PlusCircle className="w-4 h-4 text-brand-600" />
        <span>New Listing</span>
      </Link>
    </div>
  );
}
