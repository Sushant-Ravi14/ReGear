'use client';

import React, { useState } from 'react';
import { X, Tag, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastNotifications';
import { DEMO_USERS } from '@/lib/demoUser';
import { formatPrice } from '@/lib/utils';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function OfferModal({
  isOpen,
  onClose,
  product,
}: OfferModalProps) {
  const { addToast } = useToast();
  const [offeredPrice, setOfferedPrice] = useState<string | number>(
    product?.price ? Math.round(product.price * 0.9) : ''
  );
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = Number(offeredPrice);

    if (isNaN(amount) || amount <= 0) {
      addToast('Please enter a valid offer amount', 'error');
      return;
    }

    if (amount >= product.price) {
      addToast('Your offer should generally be lower than the asking price.', 'info');
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          offeredPrice: amount,
          message: message.trim(),
          buyerName: DEMO_USERS.buyer.name,
          buyerEmail: DEMO_USERS.buyer.email,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        addToast('Your offer has been submitted to the seller!', 'success');
      } else {
        addToast(data.error || 'Failed to submit offer', 'error');
      }
    } catch (err) {
      addToast('Network error submitting offer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
        <div className="bg-brand-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-300 flex items-center justify-center border border-brand-500/30">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Make a Direct Offer</h3>
              <p className="text-xs text-brand-200">Propose your price directly to the seller</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-slate-900 line-clamp-1">{product.title}</p>
              <p className="text-[11px] text-slate-500">Asking Price</p>
            </div>
            <span className="text-base font-extrabold text-brand-700 shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>

          {isSubmitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">Offer Submitted!</h4>
              <p className="text-xs text-slate-600 mb-6">
                Your offer of <strong className="text-slate-900 font-bold">{formatPrice(offeredPrice)}</strong> has been sent to the seller. You can monitor the status under your Dashboard Offers.
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
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Your Proposed Offer (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Enter offer amount"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[0.95, 0.9, 0.85].map((discountRate) => {
                    const quickPrice = Math.round(product.price * discountRate);
                    return (
                      <button
                        key={discountRate}
                        type="button"
                        onClick={() => setOfferedPrice(quickPrice)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        {formatPrice(quickPrice)} ({Math.round((1 - discountRate) * 100)}% off)
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Optional Note to Seller
                </label>
                <textarea
                  rows={3}
                  placeholder="I can pick it up tomorrow in Bengaluru or pay immediately..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 resize-none"
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
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-2 disabled:bg-brand-400"
                >
                  {isSubmitting ? (
                    <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  ) : (
                    <Tag className="w-3.5 h-3.5" />
                  )}
                  Send Offer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
