import Link from 'next/link';
import {
  ShieldCheck,
  RefreshCw,
  HeartHandshake,
  HelpCircle,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About ReGear | Our Refurbished Tech Mission',
  description:
    'Learn how ReGear connects buyers and sellers to give electronics a second life, saving up to 70% and curbing e-waste.',
};

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto py-4">
      {/* Hero Intro */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Democratizing Quality Electronics Through Circular Commerce
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          ReGear was founded on a simple insight: millions of capable laptops, phones, and gaming consoles sit idle or get discarded prematurely every year. We empower everyday users to trade certified tech with total transparency.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Verified Transparency</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Every seller declares rigorous condition criteria: functional ports, screen inspection, battery health, and repair backgrounds.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">E-Waste Mitigation</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Manufacturing new tech requires vast rare-earth mineral extraction. Re-circulating pre-owned devices reduces carbon overhead by over 70%.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Direct & Zero Fee</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            No middleman listing gouging. Buyers make direct offers, ask detailed questions, and arrange local pickups or insured deliveries safely.
          </p>
        </div>
      </div>

      {/* Refurbishment Lifecycle */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            How The ReGear Lifecycle Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Step-by-step from listing to certified ownership
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Listing & Diagnostic Checklist</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Sellers document specifications, attach high-resolution photos, and verify hardware components like battery capacity, displays, and buttons.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Discovery & Direct Negotiation</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Buyers search across categories, compare prices, make counter-offers, or send direct inquiries directly from product detail pages.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Exchange & 7-Day Guarantee</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Buyer and seller complete the exchange with transparency and peace of mind under ReGear&apos;s condition matching guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <HelpCircle className="w-5 h-5 text-brand-600" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">
              What does &quot;Sample Catalogue Item&quot; mean?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              In accordance with educational guidelines, our initial product catalogue is populated using DummyJSON products. Items marked as sample catalogue represent reference catalog listings rather than third-party verified independent inspections.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 mb-1">
              Is there any commission fee for listing devices?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              No. ReGear offers 100% free listing and zero platform deductions for sellers.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 mb-1">
              Where is data stored?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              All user listings, favorites, offers, and buyer enquiries are persistently stored in MongoDB with full server-side validation.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-8 sm:p-10 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
          Ready to Upgrade or Sell Your Tech?
        </h3>
        <p className="text-emerald-100 text-sm max-w-lg mx-auto">
          Join thousands of tech enthusiasts getting premium gear at sustainable prices.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/products"
            className="px-6 py-3 rounded-2xl bg-white text-emerald-950 font-bold text-sm hover:bg-emerald-50 transition-all shadow-md"
          >
            Explore Deals
          </Link>
          <Link
            href="/sell"
            className="px-6 py-3 rounded-2xl bg-emerald-600/70 hover:bg-emerald-600 text-white font-bold text-sm border border-emerald-400/40 transition-all"
          >
            Start Selling
          </Link>
        </div>
      </div>
    </div>
  );
}
