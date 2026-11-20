import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { productValidationSchema } from '@/validations/productSchema';
import { DEMO_USERS } from '@/lib/demoUser';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const existingCount = await Product.countDocuments();
    if (existingCount === 0) {
      const { ensureCatalogueSeeded } = await import('@/lib/dummyjson');
      await ensureCatalogueSeeded();
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || searchParams.get('q') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const condition = searchParams.get('condition');
    const brand = searchParams.get('brand');
    const status = searchParams.get('status') || 'Available';
    const sort = searchParams.get('sort') || 'newest';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const sellerId = searchParams.get('sellerId');

    const filter: Record<string, any> = {};

    // Status filter
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Category filter
    if (category && category !== 'all' && category !== 'All Products') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    // Brand filter
    if (brand && brand !== 'all') {
      filter.brand = new RegExp(`^${brand}$`, 'i');
    }

    // Condition filter (allows comma-separated multiple conditions)
    if (condition && condition !== 'all') {
      const conditions = condition.split(',').map((c) => c.trim()).filter(Boolean);
      if (conditions.length > 0) {
        filter.condition = { $in: conditions };
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Seller ID filter
    if (sellerId) {
      if (mongoose.Types.ObjectId.isValid(sellerId)) {
        filter.sellerId = new mongoose.Types.ObjectId(sellerId);
      } else {
        filter.sellerId = sellerId;
      }
    }

    // Search query filter (search across title, brand, model, description)
    if (search.trim()) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { brand: { $regex: escaped, $options: 'i' } },
        { model: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { category: { $regex: escaped, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOptions: Record<string, any> = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'discount') {
      sortOptions = { originalPrice: -1, price: 1 };
    }

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const existingCount = await Product.countDocuments();
    if (existingCount === 0) {
      const { ensureCatalogueSeeded } = await import('@/lib/dummyjson');
      await ensureCatalogueSeeded();
    }

    const body = await request.json();

    // Server-side Zod validation
    const validationResult = productValidationSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.format();
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Assign seller context (demo seller)
    const seller = DEMO_USERS.seller;
    const newProduct = await Product.create({
      ...data,
      sellerId: new mongoose.Types.ObjectId(seller._id),
      sellerName: seller.name,
      sellerEmail: seller.email,
      sellerPhone: seller.phone,
      source: 'user',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Product listing created successfully',
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product listing', details: error.message },
      { status: 500 }
    );
  }
}
