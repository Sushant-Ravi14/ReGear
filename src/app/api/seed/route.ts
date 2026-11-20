import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { DEMO_USERS } from '@/lib/demoUser';
import {
  fetchDummyJsonProducts,
  transformDummyJsonProduct,
  CURATED_CATEGORY_STARTERS,
} from '@/lib/dummyjson';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret') || request.headers.get('x-seed-secret');

    const expectedSecret = process.env.ADMIN_SEED_SECRET || 'regear_secret_seed_key_2026';

    // Allow in development without secret, but require secret in production
    if (process.env.NODE_ENV === 'production' && secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid administrative secret required' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const db = mongoose.connection.db;

    // 1. Ensure Demo Users
    await db.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId(DEMO_USERS.seller._id) as any },
      {
        $set: {
          name: DEMO_USERS.seller.name,
          email: DEMO_USERS.seller.email,
          phone: DEMO_USERS.seller.phone,
          location: DEMO_USERS.seller.location,
          role: 'seller',
          profileImage: DEMO_USERS.seller.avatar,
        },
      },
      { upsert: true }
    );

    await db.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId(DEMO_USERS.buyer._id) as any },
      {
        $set: {
          name: DEMO_USERS.buyer.name,
          email: DEMO_USERS.buyer.email,
          phone: DEMO_USERS.buyer.phone,
          location: DEMO_USERS.buyer.location,
          role: 'buyer',
          profileImage: DEMO_USERS.buyer.avatar,
        },
      },
      { upsert: true }
    );

    // 2. Fetch from DummyJSON
    const dummyProducts = await fetchDummyJsonProducts();
    const transformed = dummyProducts.map((p, idx) => transformDummyJsonProduct(p, idx));
    const allProducts = [...transformed, ...CURATED_CATEGORY_STARTERS];

    // 3. Idempotent upsert
    let upsertedCount = 0;
    for (const item of allProducts) {
      const res = await db.collection('products').updateOne(
        { source: 'dummyjson', externalProductId: item.externalProductId },
        { $set: item, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
      if (res.upsertedCount || res.modifiedCount) upsertedCount++;
    }

    const totalCount = await db.collection('products').countDocuments();

    return NextResponse.json({
      success: true,
      message: `Database catalogue seeded successfully. ${upsertedCount} items processed.`,
      totalProductsInDatabase: totalCount,
    });
  } catch (error: any) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
}
