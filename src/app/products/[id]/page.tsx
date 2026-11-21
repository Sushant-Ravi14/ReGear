import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Favorite from '@/models/Favorite';
import ProductDetailsClient from '@/components/products/ProductDetailsClient';
import { DEMO_USERS } from '@/lib/demoUser';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { title: 'Product Not Found | ReGear' };
  }

  await connectToDatabase();
  const product: any = await Product.findById(id).lean();

  if (!product) {
    return { title: 'Product Not Found | ReGear' };
  }

  return {
    title: `${product.title} - ${product.condition} | ReGear Marketplace`,
    description: product.description?.substring(0, 160) || '',
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectToDatabase();

  const product = await Product.findById(id).lean();
  if (!product) {
    notFound();
  }

  const [similarProducts, userFavorite] = await Promise.all([
    Product.find({
      _id: { $ne: product._id },
      category: (product as any).category,
      status: 'Available',
    })
      .limit(4)
      .lean(),
    Favorite.findOne({
      userId: DEMO_USERS.buyer._id,
      productId: product._id,
    }).lean(),
  ]);

  return (
    <ProductDetailsClient
      product={JSON.parse(JSON.stringify(product))}
      similarProducts={JSON.parse(JSON.stringify(similarProducts))}
      initialFavorited={Boolean(userFavorite)}
    />
  );
}
