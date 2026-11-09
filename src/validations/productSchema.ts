import { z } from 'zod';

export const productValidationSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title cannot exceed 120 characters')
    .trim(),
  brand: z
    .string({ required_error: 'Brand is required' })
    .min(1, 'Brand is required')
    .trim(),
  model: z.string().optional().default(''),
  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description must be at least 10 characters')
    .trim(),
  category: z.enum(
    [
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
    { required_error: 'Please select a valid category' }
  ),
  price: z.coerce
    .number({ required_error: 'Selling price is required' })
    .positive('Selling price must be greater than 0'),
  originalPrice: z.coerce
    .number()
    .nonnegative('Original price cannot be negative')
    .optional()
    .default(0),
  condition: z.enum(
    ['Brand New', 'Like New', 'Excellent', 'Good', 'Fair'],
    { required_error: 'Please select a condition' }
  ),
  images: z
    .array(z.string().min(1, 'Image URL cannot be empty'))
    .min(1, 'Please upload at least one product image'),
  location: z
    .string({ required_error: 'Location is required' })
    .min(2, 'Location is required')
    .trim(),
  status: z
    .enum(['Available', 'Reserved', 'Sold', 'Draft', 'Removed'])
    .optional()
    .default('Available'),
  specs: z
    .object({
      warranty: z.string().optional().default('None'),
      shipping: z.string().optional().default('Local Pickup or Shipping'),
      returnPolicy: z.string().optional().default('No Returns'),
      stock: z.coerce.number().optional().default(1),
    })
    .optional(),
  conditionChecklist: z
    .object({
      fullyFunctional: z.boolean().optional().default(true),
      screenCondition: z.string().optional().default('Clean'),
      bodyCondition: z.string().optional().default('Clean'),
      batteryHealth: z.string().optional().default('Normal'),
      accessoriesIncluded: z.string().optional().default(''),
      originalBox: z.boolean().optional().default(false),
      repairHistory: z.string().optional().default('None'),
    })
    .optional(),
});

export type ProductInput = z.infer<typeof productValidationSchema>;
