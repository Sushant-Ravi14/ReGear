import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { PRODUCT_STATUSES, ProductStatus } from '@/constants/categories';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const { status } = await request.json();

    if (!status || !PRODUCT_STATUSES.includes(status as ProductStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${PRODUCT_STATUSES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Product status updated to ${status}`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating product status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update status', details: error.message },
      { status: 500 }
    );
  }
}
