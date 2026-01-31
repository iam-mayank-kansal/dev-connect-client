'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// UI & Icons
import { ShieldCheck, Mail, Key, ArrowLeft, Loader2 } from 'lucide-react';

// Store & Validation
import { useAuthStore } from '@/store/useAuthStore';
import { otpSchema, SendOTPFormData } from '@/lib/validation/auth';
import { AuthCard } from '../ui/AuthCard';
import { AuthHeader } from '../ui/AuthHeader';
import { AuthInput } from '../ui/AuthInput';

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';

  // Store
  const { verifyPasswordResetOTP, isVerifyingOTP } = useAuthStore();

  // State
  const [formData, setFormData] = useState<SendOTPFormData>({
    email: emailFromQuery,
    otp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Effect: Sync Email from URL
  useEffect(() => {
    if (emailFromQuery) {
      setFormData((prev) => ({ ...prev, email: emailFromQuery }));
    }
  }, [emailFromQuery]);

  // Handler: Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Numeric check for OTP
    if (name === 'otp' && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on type
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handler: Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1. Validation
    const result = otpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // 2. API Call via Store
    try {
      // The store updates 'resetToken' state internally on success
      await verifyPasswordResetOTP(formData.email, formData.otp);

      // 3. Navigation
      // We check the store directly to ensure the token exists before moving forward
      const currentToken = useAuthStore.getState().resetToken;

      if (currentToken) {
        router.push('/new-password');
      } else {
        // // console.error('Verification passed but resetToken is missing in store');
      }
    } catch (error) {
      // Toast and error state handled by store
      // // console.error(error);
    }
  };

  return (
    <AuthCard
      header={
        <AuthHeader
          icon={ShieldCheck}
          title="Verify OTP"
          subtitle={`Enter the 6-digit code sent to ${formData.email || 'your email'}`}
        />
      }
      footer={
        <Link
          href="/forgot-password"
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Change Email
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          disabled={!!emailFromQuery || isVerifyingOTP}
          error={errors.email}
          placeholder="Enter your email"
          // Read-only style if email is present
          className={emailFromQuery ? 'bg-gray-50 text-gray-500' : ''}
        />

        <AuthInput
          id="otp"
          name="otp"
          type="text"
          label="One-Time Password"
          icon={Key}
          value={formData.otp}
          onChange={handleChange}
          disabled={isVerifyingOTP}
          error={errors.otp}
          maxLength={6}
          placeholder="000000"
          // Specific styling for OTP input (Monospaced, wider tracking)
          className="text-lg tracking-widest font-mono placeholder:font-sans placeholder:tracking-normal"
        />

        <button
          type="submit"
          disabled={isVerifyingOTP}
          className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold transition flex items-center justify-center ${
            isVerifyingOTP
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
          }`}
        >
          {isVerifyingOTP ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2" size={20} />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </button>
      </form>
    </AuthCard>
  );
}
