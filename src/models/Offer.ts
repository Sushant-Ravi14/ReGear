import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOffer extends Document {
  productId: mongoose.Types.ObjectId;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  offeredPrice: number;
  originalPrice: number;
  message?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
      index: true,
    },
    buyerId: {
      type: String,
      required: [true, 'Buyer ID is required'],
      index: true,
    },
    buyerName: {
      type: String,
      required: [true, 'Buyer name is required'],
      trim: true,
    },
    buyerEmail: {
      type: String,
      required: [true, 'Buyer email is required'],
      trim: true,
    },
    sellerId: {
      type: String,
      required: [true, 'Seller ID is required'],
      index: true,
    },
    offeredPrice: {
      type: Number,
      required: [true, 'Offered price is required'],
      min: [1, 'Offered price must be at least ₹1'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Withdrawn'],
      default: 'Pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

OfferSchema.index({ sellerId: 1, createdAt: -1 });
OfferSchema.index({ buyerId: 1, createdAt: -1 });

const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);

export default Offer;
