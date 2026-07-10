import { z } from 'zod';

/** Zod schema for validating Add / Edit Transaction forms */
export const transactionSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),

  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    }),

  type: z.enum(['income', 'expense']),

  category: z
    .string()
    .min(1, 'Category is required'),

  date: z
    .string()
    .min(1, 'Date is required'),

  notes: z
    .string()
    .max(500, 'Notes must be 500 characters or less')
    .optional()
    .or(z.literal('')),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
