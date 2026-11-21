import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Favorite from '@/models/Favorite';
import HeroBanner from '@/components/marketplace/HeroBanner';
import CategoryNav from '@/components/marketplace/CategoryNav';
import ProductCard from '@/components/products/ProductCard';
import { ArrowRight } from 'lucide-react';
import { DEMO_USERS } from '@/lib/demoUser';
import { ProductItem } from '@/components/products/ProductCard';

export const dynamic = 'force-dynamic';

interface HomePageData {
  featuredProducts: ProductItem[];
  latestProducts: ProductItem[];
  favoriteIds: string[];
}

async function getHomePageData(): Promise<HomePageData> {
  await connectToDatabase();

  const totalCount = await Product.countDocuments();
  if (totalCount === 0) {
    const { ensureCatalogueSeeded } = await import('@/lib/dummyjson');
    await ensureCatalogueSeeded();
  }

  const [featuredProducts, latestProducts, userFavorites] = await Promise.all([
    Product.find({ status: 'Available' })
      .sort({ price: -1 })
      .limit(8)
      .lean(),
    Product.find({ status: 'Available' })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
    Favorite.find({ userId: DEMO_USERS.buyer._id }).select('productId').lean(),
  ]);

  const favoriteIds = new Set(userFavorites.map((f: any) => String(f.productId)));

  return {
    featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
    latestProducts: JSON.parse(JSON.stringify(latestProducts)),
    favoriteIds: Array.from(favoriteIds),
  };
}

export default async function HomePage() {
  const { featuredProducts, latestProducts, favoriteIds } = await getHomePageData();
  const favoriteSet = new Set(favoriteIds);

  return (
    <div className="space-y-10">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Category Navigation Strip */}
      <CategoryNav />

      {/* 3. Featured Refurbished Tech - Clean 4-Column Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Featured Refurbished Tech
            </h2>
            <p className="text-xs text-slate-500">Inspected, benchmarked, and verified by sellers</p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
          >
            <span>Browse All ({featuredProducts.length + latestProducts.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-column product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              isFavorited={favoriteSet.has(prod._id)}
            />
          ))}
        </div>
      </section>

      {/* 4. Latest Listings Section */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Latest Marketplace Listings
            </h2>
            <p className="text-xs text-slate-500">Freshly listed phones, laptops & accessories</p>
          </div>
          <Link
            href="/products?sort=newest"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
          >
            <span>See Newest</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestProducts.map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              isFavorited={favoriteSet.has(prod._id)}
            />
          ))}
        </div>
      </section>

      {/* 5. Trust & Circular Economy Banner */}
      <section className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Save Up to 70% While Keeping E-Waste Out of Landfills.
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every year, millions of functional smartphones and laptops are discarded. ReGear makes tech recycling effortless and profitable for both buyers and sellers with rigorous condition grading and zero listing fees.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/sell"
              className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-all shadow-md"
            >
              Start Selling Today
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700"
            >
              Learn More About Our Process
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
