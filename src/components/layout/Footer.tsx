import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Equally Separated Footer Sections: Marketplace | Categories | Seller Portal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-16 pb-12 border-b border-slate-800">
          {/* Section 1: Marketplace */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide border-b border-slate-800 pb-2">
              Marketplace
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/products" className="hover:text-brand-400 transition-colors">
                  Explore All Deals
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-brand-400 transition-colors">
                  List Your Device
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-brand-400 transition-colors">
                  Saved Favorites
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors">
                  About ReGear
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 2: Categories */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide border-b border-slate-800 pb-2">
              Categories
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {CATEGORIES.slice(1, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-brand-400 transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Seller Portal */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide border-b border-slate-800 pb-2">
              Seller Portal
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/dashboard" className="hover:text-brand-400 transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/listings" className="hover:text-brand-400 transition-colors">
                  My Listings
                </Link>
              </li>
              <li>
                <Link href="/dashboard/enquiries" className="hover:text-brand-400 transition-colors">
                  Buyer Enquiries
                </Link>
              </li>
              <li>
                <Link href="/dashboard/offers" className="hover:text-brand-400 transition-colors">
                  Price Offers
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-400 transition-colors">
                  Demo Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ReGear Marketplace.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-300">Privacy &amp; Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
