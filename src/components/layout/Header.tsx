'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from '@/components/marketplace/SearchBar';
import {
  Heart,
  User,
  Menu,
  X,
  LayoutDashboard,
  ShieldAlert,
  Inbox,
  Tag,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { DEMO_USERS } from '@/lib/demoUser';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function loadFavCount() {
      try {
        const res = await fetch('/api/favorites');
        const data = await res.json();
        if (data.success && typeof data.count === 'number') {
          setFavCount(data.count);
        }
      } catch (e) {
        // quiet fallback
      }
    }
    loadFavCount();
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all duration-200 border-b ${
        isScrolled ? 'border-slate-200 shadow-xs py-2.5' : 'border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Minimal All-Green "ReGear" Logo */}
          <Link href="/" className="flex items-center shrink-0 group">
            <span className="text-2xl font-black tracking-tight text-brand-600 hover:text-brand-700 transition-colors">
              ReGear
            </span>
          </Link>

          {/* Center: Navigation & Search with premium slight borders */}
          <div className="hidden md:flex items-center gap-3 lg:gap-5 flex-1 max-w-xl mx-2 lg:mx-4">
            <nav className="flex items-center gap-2 font-medium text-sm">
              <Link
                href="/products"
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  pathname === '/products'
                    ? 'text-brand-700 font-bold bg-brand-50 border-brand-300 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                Shop
              </Link>
              <Link
                href="/sell"
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  pathname === '/sell'
                    ? 'text-brand-700 font-bold bg-brand-50 border-brand-300 shadow-2xs'
                    : 'text-brand-700 hover:text-brand-800 bg-brand-50/50 hover:bg-brand-50 border-brand-200/80 hover:border-brand-300 shadow-2xs'
                }`}
              >
                <span>Sell</span>
              </Link>
            </nav>

            <div className="flex-1">
              <SearchBar />
            </div>
          </div>

          {/* Right: Actions with premium slight borders */}
          <div className="flex items-center gap-2.5">
            {/* Favorites Icon Button with subtle border */}
            <Link
              href="/favorites"
              aria-label="Favorites"
              className="relative p-2 rounded-xl text-slate-700 hover:text-rose-600 bg-white hover:bg-rose-50/50 border border-slate-200/80 hover:border-rose-200 transition-all shadow-2xs flex items-center justify-center"
            >
              <Heart className="w-4 h-4" />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-xs">
                  {favCount > 9 ? '9+' : favCount}
                </span>
              )}
            </Link>

            {/* List Item Button with subtle border */}
            <Link
              href="/sell"
              className="hidden lg:inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-xs hover:shadow-sm border border-emerald-500/70 hover:border-emerald-400 active:scale-95"
            >
              <span>List Item</span>
            </Link>

            {/* My Account Dropdown Button with subtle border */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-slate-700 text-sm font-semibold shadow-2xs"
              >
                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline-block">Account</span>
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Demo User
                    </p>
                    <p className="font-bold text-slate-900 text-sm">{DEMO_USERS.seller.name}</p>
                    <p className="text-xs text-slate-500 truncate">{DEMO_USERS.seller.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Seller Dashboard
                    </Link>
                    <Link
                      href="/dashboard/listings"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-400" />
                      My Listings
                    </Link>
                    <Link
                      href="/dashboard/enquiries"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium"
                    >
                      <Inbox className="w-4 h-4 text-slate-400" />
                      Enquiries
                    </Link>
                    <Link
                      href="/dashboard/offers"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium"
                    >
                      <Tag className="w-4 h-4 text-slate-400" />
                      Offers
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      Saved Favorites
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                      Admin Moderation Demo
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu hamburger button with subtle border */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200/80 bg-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="mt-3 md:hidden">
          <SearchBar />
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-slate-100 mt-3 space-y-1">
            <Link
              href="/products"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50"
            >
              <span>Shop All Products</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/sell"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-brand-700 font-bold text-sm bg-brand-50"
            >
              <span>Sell a Device (+ Free Listing)</span>
              <ArrowRight className="w-4 h-4 text-brand-600" />
            </Link>
            <Link
              href="/favorites"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50"
            >
              <span>Saved Favorites</span>
              <span className="text-xs text-brand-600 font-bold">{favCount} items</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50"
            >
              <span>Seller Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-500 font-medium text-sm hover:bg-slate-50"
            >
              <span>About ReGear</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
