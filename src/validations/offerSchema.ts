import { z } from 'zod';

export const offerValidationSchema = z.object({
  productId: z
    .string({ required_error: 'Product ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
  offeredPrice: z.coerce
    .number({ required_error: 'Offer amount is required' })
    .positive('Offer amount must be greater than 0'),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional().default(''),
  buyerName: z.string().min(2, 'Name must be at least 2 characters').trim(),
  buyerEmail: z.string().email('Please enter a valid email address').trim().toLowerCase(),
});

export type OfferInput = z.infer<typeof offerValidationSchema>;
