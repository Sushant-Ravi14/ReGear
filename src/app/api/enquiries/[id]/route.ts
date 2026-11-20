import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';

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
        { success: false, error: 'Invalid enquiry ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, response } = body;

    const allowedStatuses = ['Pending', 'Responded', 'Closed'];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Status must be one of: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updateFields: Record<string, any> = { updatedAt: new Date() };
    if (status) updateFields.status = status;
    if (response !== undefined) updateFields.response = response;

    const updated = await Enquiry.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update enquiry', details: error.message },
      { status: 500 }
    );
  }
}
