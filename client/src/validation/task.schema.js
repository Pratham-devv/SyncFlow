import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title must be under 120 characters'),
  description: z
    .string()
    .max(1000, 'Description must be under 1000 characters')
    .optional()
    .or(z.literal('')),
  priority: z.enum(['Low', 'Medium', 'High'], {
    errorMap: () => ({ message: 'Priority must be Low, Medium, or High' }),
  }),
  dueDate: z
    .string()
    .optional()
    .or(z.literal('')),
  assignedTo: z
    .string()
    .optional()
    .or(z.literal('')),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title must be under 120 characters'),
  description: z
    .string()
    .max(1000, 'Description must be under 1000 characters')
    .optional()
    .or(z.literal('')),
  priority: z.enum(['Low', 'Medium', 'High'], {
    errorMap: () => ({ message: 'Priority must be Low, Medium, or High' }),
  }),
  dueDate: z
    .string()
    .optional()
    .or(z.literal('')),
});
