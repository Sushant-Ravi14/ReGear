'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductGallery from '@/components/products/ProductGallery';
import ConditionBadge from '@/components/products/ConditionBadge';
import PriceDisplay from '@/components/products/PriceDisplay';
import FavoriteButton from '@/components/products/FavoriteButton';
import ProductCard from '@/components/products/ProductCard';
import EnquiryModal from '@/components/forms/EnquiryModal';
import OfferModal from '@/components/forms/OfferModal';
import {
  MapPin,
  ShieldCheck,
  MessageSquare,
  Tag,
  CheckCircle2,
  User,
  Clock,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastNotifications';
import { formatDate } from '@/lib/utils';

interface ProductDetailsClientProps {
  product: any;
  similarProducts?: any[];
  initialFavorited?: boolean;
}

export default function ProductDetailsClient({
  product,
  similarProducts = [],
  initialFavorited = false,
}: ProductDetailsClientProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const { addToast } = useToast();

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      addToast('Listing URL copied to clipboard!', 'info');
    }
  };

  const isAvailable = product.status === 'Available';
  const checklist = product.conditionChecklist || {};
  const specs = product.specs || {};

  return (
    <div className="space-y-12">
      {/* Top breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery (6 cols) */}
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Right Column: Key Details & Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {product.brand}
                </span>
                <span className="text-slate-300">•</span>
                <Link
                  href={`/categories/${product.category?.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  {product.category}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <ConditionBadge condition={product.condition} />
                <FavoriteButton
                  productId={product._id}
                  initialFavorited={initialFavorited}
                  size="md"
                />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.title}
            </h1>

            {product.model && (
              <p className="text-xs text-slate-500 mt-1">
                Model: <span className="font-semibold text-slate-700">{product.model}</span>
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{product.location}</span>
              <span className="text-slate-300">•</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Listed {formatDate(product.createdAt)}</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                Selling Price
              </p>
              <PriceDisplay
                price={product.price}
                originalPrice={product.originalPrice}
                size="lg"
              />
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isAvailable
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                {product.status}
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setOfferOpen(true)}
              disabled={!isAvailable}
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Tag className="w-4 h-4" />
              <span>Make an Offer</span>
            </button>

            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-brand-600" />
              <span>Contact Seller</span>
            </button>
          </div>

          {/* ReGear Trust Assurances */}
          <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100/80 space-y-2 text-xs text-brand-900">
            <div className="flex items-center gap-2 font-bold text-brand-800">
              <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
              <span>ReGear Refurbished Assurance</span>
            </div>
            <p className="text-brand-800/80 text-[11px] leading-relaxed">
              Tested for functional integrity. 7-day replacement warranty provided with verified local pickup or insured shipping.
            </p>
          </div>

          {/* Seller Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-base border border-slate-200 shrink-0">
                <User className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">{product.sellerName || 'Verified Seller'}</h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-400">Response time: Usually within an hour</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline px-3 py-1.5 rounded-xl border border-brand-200 bg-brand-50/50"
            >
              Message
            </button>
          </div>
        </div>
      </div>

      {/* Description & Transparency Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
        {/* Left Column: Description (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              Product Overview & Details
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            {/* Hardware specifications */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Warranty</p>
                <p className="text-slate-800 font-semibold mt-0.5">{specs.warranty || '30 Days Certified'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Shipping Terms</p>
                <p className="text-slate-800 font-semibold mt-0.5">{specs.shipping || 'Express Shipping or Pickup'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Return Policy</p>
                <p className="text-slate-800 font-semibold mt-0.5">{specs.returnPolicy || '7 Days Replacement'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Stock Availability</p>
                <p className="text-slate-800 font-semibold mt-0.5">{specs.stock ? `${specs.stock} unit(s)` : 'Single Device'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Condition Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Condition Checklist
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Operational Status</p>
                  <p className="text-slate-500">
                    {checklist.fullyFunctional ? '100% Fully Functional & bench-tested' : 'Parts or repair only'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Display / Screen</p>
                  <p className="text-slate-500">{checklist.screenCondition || 'Zero dead pixels or scratches'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Chassis & Body</p>
                  <p className="text-slate-500">{checklist.bodyCondition || 'Minimal cosmetic signs of normal use'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Battery Condition</p>
                  <p className="text-slate-500">{checklist.batteryHealth || '85%+ health retention verified'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Accessories Included</p>
                  <p className="text-slate-500">{checklist.accessoriesIncluded || 'Compatible charger included'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Repair History</p>
                  <p className="text-slate-500">{checklist.repairHistory || 'Clean diagnostic check'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Similar {product.category} Deals
              </h2>
              <p className="text-xs text-slate-500">Other certified options in the same category</p>
            </div>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              View More →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        product={product}
      />
      <OfferModal
        isOpen={offerOpen}
        onClose={() => setOfferOpen(false)}
        product={product}
      />
    </div>
  );
}
