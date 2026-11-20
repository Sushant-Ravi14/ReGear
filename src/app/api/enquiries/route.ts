import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import Product from '@/models/Product';
import { enquiryValidationSchema } from '@/validations/enquirySchema';
import { DEMO_USERS } from '@/lib/demoUser';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const buyerId = searchParams.get('buyerId');

    const filter: Record<string, any> = {};
    if (sellerId) {
      filter.sellerId = sellerId;
    } else if (buyerId) {
      filter.buyerId = buyerId;
    } else {
      // Default to demo seller
      filter.sellerId = String(DEMO_USERS.seller._id);
    }

    const enquiries = await Enquiry.find(filter)
      .populate({
        path: 'productId',
        model: Product,
        select: 'title price images category condition',
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: enquiries,
      count: enquiries.length,
    });
  } catch (error: any) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enquiries', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const validationResult = enquiryValidationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { productId, message, buyerName, buyerEmail, buyerPhone } = validationResult.data;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product does not exist' },
        { status: 404 }
      );
    }

    const newEnquiry = await Enquiry.create({
      productId,
      buyerId: String(DEMO_USERS.buyer._id),
      buyerName,
      buyerEmail,
      buyerPhone: buyerPhone || '',
      sellerId: String(product.sellerId),
      message,
      status: 'Pending',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Enquiry sent successfully to the seller',
        data: newEnquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send enquiry', details: error.message },
      { status: 500 }
    );
  }
}
