import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiry extends Document {
  productId: mongoose.Types.ObjectId;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  sellerId: string;
  message: string;
  status: 'Pending' | 'Responded' | 'Closed';
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
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
    buyerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    sellerId: {
      type: String,
      required: [true, 'Seller ID is required'],
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Enquiry message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Responded', 'Closed'],
      default: 'Pending',
      index: true,
    },
    response: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

EnquirySchema.index({ sellerId: 1, createdAt: -1 });
EnquirySchema.index({ buyerId: 1, createdAt: -1 });

const Enquiry: Model<IEnquiry> = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
