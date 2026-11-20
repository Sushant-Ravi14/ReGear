import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import Product from '@/models/Product';
import { DEMO_USERS } from '@/lib/demoUser';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || DEMO_USERS.buyer._id;

    const favorites = await Favorite.find({ userId })
      .populate({
        path: 'productId',
        model: Product,
      })
      .sort({ createdAt: -1 })
      .lean();

    // Filter out any favorites whose referenced product was deleted
    const validFavorites = favorites.filter((fav: any) => fav.productId != null);

    return NextResponse.json({
      success: true,
      data: validFavorites,
      count: validFavorites.length,
    });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const productId = body.productId;
    const userId = body.userId || DEMO_USERS.buyer._id;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: 'Valid Product ID is required' },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product does not exist' },
        { status: 404 }
      );
    }

    // Upsert to prevent duplicate key error gracefully
    const favorite = await Favorite.findOneAndUpdate(
      { userId, productId: new mongoose.Types.ObjectId(productId) },
      { userId, productId: new mongoose.Types.ObjectId(productId) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Product added to favorites',
        data: favorite,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add favorite', details: error.message },
      { status: 500 }
    );
  }
}
