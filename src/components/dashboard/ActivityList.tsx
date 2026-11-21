import Link from 'next/link';
import { formatDate, formatPrice } from '@/lib/utils';
import { MessageSquare, Tag, ArrowRight, Clock } from 'lucide-react';

export interface RecentEnquiry {
  _id: string;
  buyerName: string;
  message: string;
  createdAt: string | Date;
  status: string;
}

export interface RecentOffer {
  _id: string;
  offeredPrice: number;
  originalPrice: number;
  buyerName: string;
  createdAt: string | Date;
  status: string;
}

export interface RecentActivityData {
  enquiries?: RecentEnquiry[];
  offers?: RecentOffer[];
}

interface ActivityListProps {
  recentActivity: RecentActivityData | null;
}

export default function ActivityList({ recentActivity }: ActivityListProps) {
  const enquiries = recentActivity?.enquiries || [];
  const offers = recentActivity?.offers || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Enquiries */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Recent Enquiries</h3>
            </div>
            <Link
              href="/dashboard/enquiries"
              className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">
              No buyer enquiries received yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {enquiries.slice(0, 4).map((enq) => (
                <div key={enq._id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{enq.buyerName}</p>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      &quot;{enq.message}&quot;
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(enq.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      enq.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Offers */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Recent Price Offers</h3>
            </div>
            <Link
              href="/dashboard/offers"
              className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {offers.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">
              No price offers submitted yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {offers.slice(0, 4).map((off) => (
                <div key={off._id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-slate-900">
                        {formatPrice(off.offeredPrice)}
                      </span>
                      {off.originalPrice > 0 && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(off.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      From: {off.buyerName}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(off.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      off.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : off.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {off.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
