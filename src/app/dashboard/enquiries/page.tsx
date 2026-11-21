'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardNav from '@/components/dashboard/DashboardNav';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastNotifications';
import {
  Inbox,
  ExternalLink,
  Send,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { DEMO_USERS } from '@/lib/demoUser';

interface EnquiryRecord {
  _id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  message: string;
  status: string;
  response?: string;
  createdAt: string | Date;
  productId?: {
    _id: string;
    title: string;
  };
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { addToast } = useToast();

  const loadEnquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/enquiries?sellerId=${DEMO_USERS.seller._id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEnquiries(data.data);
      }
    } catch (err) {
      addToast('Failed to load enquiries', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleUpdateStatus = async (enquiryId: string, newStatus: string, responseText = '') => {
    setUpdatingId(enquiryId);
    try {
      const payload: { status: string; response?: string } = { status: newStatus };
      if (responseText) {
        payload.response = responseText;
      }

      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === enquiryId ? data.data : e))
        );
        addToast(`Enquiry marked as ${newStatus}`, 'success');
      } else {
        addToast(data.error || 'Failed to update enquiry', 'error');
      }
    } catch (err) {
      addToast('Network error updating enquiry', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Buyer Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review questions, respond to potential buyers, and mark discussions as resolved.
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
      ) : enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const product = enq.productId;
            const isPending = enq.status === 'Pending';

            return (
              <div
                key={enq._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
              >
                {/* Header: Product & Buyer Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{enq.buyerName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPending
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {enq.buyerEmail}
                        </span>
                        {enq.buyerPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {enq.buyerPhone}
                          </span>
                        )}
                        <span>•</span>
                        <span>{formatDate(enq.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {product && (
                    <Link
                      href={`/products/${product._id}`}
                      className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 self-start sm:self-center"
                    >
                      <span>Item: {product.title}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed">
                  <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Buyer Question:
                  </p>
                  &quot;{enq.message}&quot;
                </div>

                {/* Response / Existing reply */}
                {enq.response ? (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-sm text-emerald-900 leading-relaxed">
                    <p className="font-bold text-xs text-emerald-700 uppercase tracking-wider mb-1">
                      Your Response:
                    </p>
                    {enq.response}
                  </div>
                ) : (
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Type a quick response back to the buyer..."
                      value={replyTextMap[enq._id] || ''}
                      onChange={(e) =>
                        setReplyTextMap({ ...replyTextMap, [enq._id]: e.target.value })
                      }
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                    />
                    <button
                      type="button"
                      disabled={updatingId === enq._id}
                      onClick={() =>
                        handleUpdateStatus(
                          enq._id,
                          'Responded',
                          replyTextMap[enq._id] || 'Thank you for your enquiry. We will reach out shortly!'
                        )
                      }
                      className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply & Mark Responded</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No enquiries yet"
          description="When prospective buyers ask questions about your gadgets, they will show up here."
          icon={Inbox}
        />
      )}
    </div>
  );
}
