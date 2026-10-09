import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(70, 'Full name is too long'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['customer', 'technician'], {
    message: 'Please choose whether you are a Customer or Technician',
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type UserRole = 'customer' | 'technician';

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(70, 'Full name is too long'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required'),
  address: z
    .string()
    .trim()
    .min(1, 'Address is required')
    .max(150, 'Address is too long'),
  role: z.enum(['customer', 'technician']),
  profession: z.string().trim().optional(),
  yearsOfExperience: z.string().trim().optional(),
  hourlyRate: z.string().trim().optional(),
  bio: z.string().trim().max(500, 'Bio must be under 500 characters').optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  profession?: string;
  yearsOfExperience?: string | number;
  hourlyRate?: string;
  bio?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}
