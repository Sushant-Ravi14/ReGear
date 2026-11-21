import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductForm from '@/components/forms/ProductForm';
import { ArrowLeft, Edit3 } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: 'Edit Listing | ReGear Marketplace',
  };
}

export default async function EditListingPage({ params }: PageProps) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectToDatabase();
  const product: any = await Product.findById(id).lean();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/listings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Listings</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Edit &quot;{product.title}&quot;
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Update pricing, photos, or condition notes for this listing.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 shrink-0">
            <Edit3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <ProductForm initialData={JSON.parse(JSON.stringify(product))} isEditing={true} />
    </div>
  );
}
