import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import { DEMO_USERS } from '@/lib/demoUser';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || DEMO_USERS.buyer._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Try deleting either by Favorite _id or by (productId + userId)
    let deleted = await Favorite.findByIdAndDelete(id);

    if (!deleted) {
      deleted = await Favorite.findOneAndDelete({
        productId: new mongoose.Types.ObjectId(id),
        userId: userId,
      });
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Favorite entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product removed from favorites',
    });
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove favorite', details: error.message },
      { status: 500 }
    );
  }
}
