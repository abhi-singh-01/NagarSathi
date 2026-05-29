import { z } from 'zod';
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from '../models/Complaint';

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6).max(128),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional()
    .or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const createComplaintSchema = z.object({
  category: z.enum(COMPLAINT_CATEGORIES as unknown as [string, ...string[]]),
  description: z.string().trim().min(10).max(500),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  address: z.string().trim().max(500).optional(),
  accuracy: z.coerce.number().optional(),
});

export const updateComplaintSchema = z.object({
  description: z.string().trim().min(10).max(500).optional(),
  address: z.string().trim().max(500).optional(),
  status: z.enum(COMPLAINT_STATUSES as unknown as [string, ...string[]]).optional(),
  statusNote: z.string().trim().max(500).optional(),
});

export const nearbyQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(100).max(50000).default(5000),
  limit: z.coerce.number().min(1).max(100).default(50),
  category: z.enum(COMPLAINT_CATEGORIES as unknown as [string, ...string[]]).optional(),
});

export const listQuerySchema = z.object({
  status: z.enum(COMPLAINT_STATUSES as unknown as [string, ...string[]]).optional(),
  category: z.enum(COMPLAINT_CATEGORIES as unknown as [string, ...string[]]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});
