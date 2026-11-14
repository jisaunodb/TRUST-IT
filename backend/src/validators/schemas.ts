import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const setupAdminSchema = z.object({
  name: z.string().trim().min(2, 'Full name is required'),
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Please provide your full name'),
  email: z.string().email('Please provide a valid email address'),
  phone: z.string().min(6, 'Please provide a valid phone number'),
  company: z.string().optional().default(''),
  service: z.string().min(2, 'Please select a service'),
  budget: z.string().min(2, 'Please select an estimated budget'),
  message: z.string().min(10, 'Please describe your project requirements (at least 10 characters)'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

export const jobApplicationSchema = z.object({
  careerId: z.string().min(1, 'Position reference is required'),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  linkedin: z.string().optional().default(''),
  portfolio: z.string().optional().default(''),
  coverLetter: z.string().min(20, 'Please include a brief cover letter (at least 20 characters)'),
});

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
