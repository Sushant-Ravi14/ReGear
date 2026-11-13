import Link from 'next/link';
import { Sparkles, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 border border-brand-100 shadow-sm">
        <Sparkles className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-brand-600 px-3 py-1 rounded-full bg-brand-50 mb-3 border border-brand-200">
        404 — Page Not Found
      </span>

      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
        This Device is Off The Grid
      </h1>

      <p className="text-slate-600 max-w-md text-sm sm:text-base leading-relaxed mb-8">
        The product listing or page you&apos;re searching for may have been sold, removed, or relocated in our verified tech directory.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-sm"
        >
          <Home className="w-4 h-4" />
          Back to Homepage
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition-all shadow-xs"
        >
          <Search className="w-4 h-4" />
          Browse All Products
        </Link>
      </div>
    </div>
  );
}
