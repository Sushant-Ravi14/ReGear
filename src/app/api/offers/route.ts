import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Offer from '@/models/Offer';
import Product from '@/models/Product';
import { offerValidationSchema } from '@/validations/offerSchema';
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
      // Default to demo seller offers
      filter.sellerId = String(DEMO_USERS.seller._id);
    }

    const offers = await Offer.find(filter)
      .populate({
        path: 'productId',
        model: Product,
        select: 'title price images category condition status',
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: offers,
      count: offers.length,
    });
  } catch (error: any) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch offers', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const validationResult = offerValidationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { productId, offeredPrice, message, buyerName, buyerEmail } = validationResult.data;

    // Verify product exists and is available
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.status !== 'Available') {
      return NextResponse.json(
        { success: false, error: `Product is currently ${product.status.toLowerCase()} and cannot accept new offers` },
        { status: 400 }
      );
    }

    const newOffer = await Offer.create({
      productId,
      buyerId: String(DEMO_USERS.buyer._id),
      buyerName,
      buyerEmail,
      sellerId: String(product.sellerId),
      offeredPrice,
      originalPrice: product.price,
      message: message || '',
      status: 'Pending',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your offer has been submitted to the seller',
        data: newOffer,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit offer', details: error.message },
      { status: 500 }
    );
  }
}
