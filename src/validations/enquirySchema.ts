import { z } from 'zod';

export const enquiryValidationSchema = z.object({
  productId: z
    .string({ required_error: 'Product ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
  message: z
    .string({ required_error: 'Message is required' })
    .min(5, 'Message must be at least 5 characters')
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim(),
  buyerName: z.string().min(2, 'Name must be at least 2 characters').trim(),
  buyerEmail: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  buyerPhone: z.string().optional().default(''),
});

export type EnquiryInput = z.infer<typeof enquiryValidationSchema>;
