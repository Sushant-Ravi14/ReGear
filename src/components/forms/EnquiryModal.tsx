'use client';

import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastNotifications';
import { DEMO_USERS } from '@/lib/demoUser';
import { formatPrice } from '@/lib/utils';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  product,
}: EnquiryModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    message: '',
    buyerName: DEMO_USERS.buyer.name,
    buyerEmail: DEMO_USERS.buyer.email,
    buyerPhone: DEMO_USERS.buyer.phone,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.message.trim() || formData.message.length < 5) {
      addToast('Message must be at least 5 characters long', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          message: formData.message.trim(),
          buyerName: formData.buyerName,
          buyerEmail: formData.buyerEmail,
          buyerPhone: formData.buyerPhone,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSent(true);
        addToast('Enquiry sent to the seller!', 'success');
      } else {
        addToast(data.error || 'Failed to submit enquiry', 'error');
      }
    } catch (err) {
      addToast('Network error sending enquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSent(false);
    setFormData({ ...formData, message: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Contact Seller</h3>
              <p className="text-xs text-slate-400">Ask questions regarding this item</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-slate-900 line-clamp-1">{product.title}</p>
              <p className="text-[11px] text-slate-500">{product.condition} • {product.location}</p>
            </div>
            <span className="text-sm font-bold text-slate-900 shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>

          {isSent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">Enquiry Delivered!</h4>
              <p className="text-xs text-slate-600 mb-6">
                Your message has been saved to MongoDB and sent to the seller dashboard. The seller will contact you via email or phone.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.buyerName}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.buyerEmail}
                    onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Message to Seller
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Hello, is this item still available? Does it come with the original charger?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-2 disabled:bg-brand-400"
                >
                  {isSubmitting ? (
                    <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Send Enquiry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
