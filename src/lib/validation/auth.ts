// VALIDATION SCHEMAS - Auth
// Zod schemas for validating auth forms and generating TypeScript types

import { z } from 'zod';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
const PASSWORD_ERROR =
  'Password must be 8+ chars, include uppercase, lowercase, number, and special char (@$!%*?&)';

// Login Form Validation
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

// Sign Up Form Validation
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(PASSWORD_REGEX, PASSWORD_ERROR),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignUpFormErrors = Partial<Record<keyof SignUpFormData, string>>;

// OTP Verification Validation
export const otpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  otp: z
    .string()
    .min(6, 'OTP must be 6 characters')
    .max(6, 'OTP must be 6 characters')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

// 1. Set New Password (Used when recovering account with a Token)
export const setNewPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, 'Password is required')
      .regex(PASSWORD_REGEX, PASSWORD_ERROR),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SetNewPasswordFormData = z.infer<typeof setNewPasswordSchema>;

// 2. Change Password (Used when user is logged in: Old + New)
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .regex(PASSWORD_REGEX, PASSWORD_ERROR),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password cannot be the same as the old password',
    path: ['newPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
// Send OTP Validation
export const sendOTPSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  otp: z
    .string()
    .min(6, 'OTP must be 6 characters')
    .max(6, 'OTP must be 6 characters')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export type SendOTPFormData = z.infer<typeof sendOTPSchema>;
