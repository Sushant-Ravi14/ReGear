import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Offer from '@/models/Offer';

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
        { success: false, error: 'Invalid offer ID format' },
        { status: 400 }
      );
    }

    const { status } = await request.json();
    const allowedStatuses = ['Pending', 'Accepted', 'Rejected', 'Withdrawn'];

    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const currentOffer = await Offer.findById(id);
    if (!currentOffer) {
      return NextResponse.json(
        { success: false, error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Status transition rules
    if (currentOffer.status === 'Rejected' && status !== 'Rejected') {
      return NextResponse.json(
        { success: false, error: 'Cannot alter a rejected offer' },
        { status: 400 }
      );
    }

    currentOffer.status = status;
    currentOffer.updatedAt = new Date();
    await currentOffer.save();

    return NextResponse.json({
      success: true,
      message: `Offer status successfully updated to ${status}`,
      data: currentOffer,
    });
  } catch (error: any) {
    console.error('Error updating offer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update offer', details: error.message },
      { status: 500 }
    );
  }
}
