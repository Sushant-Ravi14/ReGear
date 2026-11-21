import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Enquiry from '@/models/Enquiry';
import Offer from '@/models/Offer';
import { DEMO_USERS } from '@/lib/demoUser';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId') || String(DEMO_USERS.seller._id);

    // Filter by seller where appropriate
    const sellerFilter = {
      $or: [
        { sellerId: mongoose.Types.ObjectId.isValid(sellerId) ? new mongoose.Types.ObjectId(sellerId) : sellerId },
        { sellerId: new mongoose.Types.ObjectId(DEMO_USERS.seller._id) },
        { source: 'dummyjson' }, // Demo seller manages catalogue
      ],
    };

    const [
      totalListings,
      activeListings,
      soldListings,
      reservedListings,
      pendingEnquiries,
      pendingOffers,
      valueAggregation,
      recentListings,
      recentEnquiries,
      recentOffers,
    ] = await Promise.all([
      Product.countDocuments(sellerFilter),
      Product.countDocuments({ ...sellerFilter, status: 'Available' }),
      Product.countDocuments({ ...sellerFilter, status: 'Sold' }),
      Product.countDocuments({ ...sellerFilter, status: 'Reserved' }),
      Enquiry.countDocuments({ sellerId: String(DEMO_USERS.seller._id), status: 'Pending' }),
      Offer.countDocuments({ sellerId: String(DEMO_USERS.seller._id), status: 'Pending' }),
      Product.aggregate([
        { $match: { ...sellerFilter, status: 'Available' } },
        { $group: { _id: null, totalValue: { $sum: '$price' } } },
      ]),
      Product.find(sellerFilter).sort({ createdAt: -1 }).limit(5).lean(),
      Enquiry.find({ sellerId: String(DEMO_USERS.seller._id) })
        .populate('productId', 'title price')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Offer.find({ sellerId: String(DEMO_USERS.seller._id) })
        .populate('productId', 'title price')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const totalValue = valueAggregation.length > 0 ? valueAggregation[0].totalValue : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalListings,
        activeListings,
        soldListings,
        reservedListings,
        pendingEnquiries,
        pendingOffers,
        totalValue,
      },
      recentActivity: {
        listings: recentListings,
        enquiries: recentEnquiries,
        offers: recentOffers,
      },
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to aggregate statistics', details: error.message },
      { status: 500 }
    );
  }
}
