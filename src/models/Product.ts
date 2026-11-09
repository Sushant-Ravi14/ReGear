import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductSpecs {
  warranty?: string;
  shipping?: string;
  returnPolicy?: string;
  stock?: number;
  rating?: number;
  tags?: string[];
}

export interface IConditionChecklist {
  fullyFunctional?: boolean;
  screenCondition?: string;
  bodyCondition?: string;
  batteryHealth?: string;
  accessoriesIncluded?: string;
  originalBox?: boolean;
  repairHistory?: string;
}

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  title: string;
  brand: string;
  model?: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  condition: 'Brand New' | 'Like New' | 'Excellent' | 'Good' | 'Fair';
  images: string[];
  location: string;
  sellerId: mongoose.Types.ObjectId;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Draft' | 'Removed';
  source: 'dummyjson' | 'user';
  externalProductId?: string | null;
  specs?: IProductSpecs;
  conditionChecklist?: IConditionChecklist;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
    },
    model: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: [
        'Smartphones',
        'Laptops',
        'Tablets',
        'Gaming',
        'PC Components',
        'Monitors',
        'Audio',
        'Accessories',
        'Other',
      ],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Price must be positive'],
      index: true,
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be positive'],
      default: 0,
    },
    condition: {
      type: String,
      required: [true, 'Product condition is required'],
      enum: ['Brand New', 'Like New', 'Excellent', 'Good', 'Fair'],
      index: true,
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one image URL is required',
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
      index: true,
    },
    sellerName: {
      type: String,
      default: 'ReGear Seller',
    },
    sellerEmail: {
      type: String,
      default: '',
    },
    sellerPhone: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Sold', 'Draft', 'Removed'],
      default: 'Available',
      index: true,
    },
    source: {
      type: String,
      enum: ['dummyjson', 'user'],
      default: 'user',
      index: true,
    },
    externalProductId: {
      type: String,
      default: null,
      index: true,
    },
    specs: {
      warranty: { type: String, default: '30 Days ReGear Warranty' },
      shipping: { type: String, default: 'Available for Shipping or Local Pickup' },
      returnPolicy: { type: String, default: '7 Days Return Policy' },
      stock: { type: Number, default: 1 },
      rating: { type: Number, default: 4.5 },
      tags: { type: [String], default: [] },
    },
    conditionChecklist: {
      fullyFunctional: { type: Boolean, default: true },
      screenCondition: { type: String, default: 'Flawless' },
      bodyCondition: { type: String, default: 'Clean' },
      batteryHealth: { type: String, default: 'Good' },
      accessoriesIncluded: { type: String, default: 'Charger included' },
      originalBox: { type: Boolean, default: false },
      repairHistory: { type: String, default: 'No known issues' },
    },
  },
  {
    timestamps: true,
  }
);

// Full-text search index
ProductSchema.index({
  title: 'text',
  brand: 'text',
  model: 'text',
  description: 'text',
  category: 'text',
});

// Compound indexes
ProductSchema.index({ status: 1, category: 1, price: 1 });
ProductSchema.index({ status: 1, condition: 1 });
ProductSchema.index({ sellerId: 1, createdAt: -1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
