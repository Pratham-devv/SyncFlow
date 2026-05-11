import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(80, 'Title must be under 80 characters'),
  description: z
    .string()
    .max(500, 'Description must be under 500 characters')
    .optional()
    .or(z.literal('')),
});

export const addMemberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
