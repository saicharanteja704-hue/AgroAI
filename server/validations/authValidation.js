import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120, 'Name must be at most 120 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().trim().optional().or(z.literal('')),
  preferred_language: z.string().trim().default('English').optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().optional().nullable(),
  preferred_language: z.string().trim().optional(),
  location: z.string().trim().optional().nullable(),
  state: z.string().trim().optional().nullable(),
  district: z.string().trim().optional().nullable(),
  farm_size: z.union([z.number(), z.string().transform((v) => (v === '' ? null : Number(v)))]).optional().nullable(),
  primary_crops: z.union([z.array(z.string()), z.string().transform((v) => v ? v.split(',').map(s => s.trim()) : [])]).optional(),
  experience_years: z.union([z.number(), z.string().transform((v) => (v === '' ? null : Number(v)))]).optional().nullable(),
});
