import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  productId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Prevent duplicate favorites for the same user and product
FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Favorite: Model<IFavorite> = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;
