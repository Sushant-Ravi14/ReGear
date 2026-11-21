import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Favorite from '@/models/Favorite';
import { CATEGORIES } from '@/constants/categories';
import ProductGrid from '@/components/products/ProductGrid';
import { ArrowLeft, Filter } from 'lucide-react';
import { DEMO_USERS } from '@/lib/demoUser';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = params;
  const matched = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === category.toLowerCase()
  );
  const title = matched ? matched.label : category;

  return {
    title: `${title} | ReGear Marketplace`,
    description: matched?.description || `Explore certified refurbished ${title} on ReGear.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;

  // Match category configuration
  const categoryConfig = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === category.toLowerCase()
  );

  await connectToDatabase();

  const existingCount = await Product.countDocuments();
  if (existingCount === 0) {
    const { ensureCatalogueSeeded } = await import('@/lib/dummyjson');
    await ensureCatalogueSeeded();
  }

  const categoryLabel = categoryConfig ? categoryConfig.label : category;

  const [products, userFavorites] = await Promise.all([
    Product.find({
      category: new RegExp(`^${categoryLabel}$`, 'i'),
      status: 'Available',
    })
      .sort({ createdAt: -1 })
      .lean(),
    Favorite.find({ userId: DEMO_USERS.buyer._id }).select('productId').lean(),
  ]);

  const favoriteIds = new Set(userFavorites.map((f: any) => String(f.productId)));

  return (
    <div className="space-y-8">
      {/* Back button and Category Header */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-400">
                {products.length} {products.length === 1 ? 'item' : 'items'} available
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Refurbished {categoryLabel}
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
              {categoryConfig?.description ||
                `Browse our verified pre-owned collection of ${categoryLabel}. Bench-tested with certified hardware reports.`}
            </p>
          </div>

          <Link
            href={`/products?category=${encodeURIComponent(categoryLabel)}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-sm border border-brand-200 self-start md:self-center transition-all"
          >
            <Filter className="w-4 h-4" />
            <span>Filter This Category</span>
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={JSON.parse(JSON.stringify(products))}
        favorites={Array.from(favoriteIds)}
        columns={4}
      />
    </div>
  );
}
