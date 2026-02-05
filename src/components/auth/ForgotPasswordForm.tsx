'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// UI & Icons
import { Mail, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';

// Store & Validation
import { useAuthStore } from '@/store/useAuthStore';
import { sendOTPSchema } from '@/lib/validation/auth';
import { AuthHeader } from '../ui/AuthHeader';
import { AuthCard } from '../ui/AuthCard';
import { AuthInput } from '../ui/AuthInput';
import { getErrorMessage } from '@/lib/utils/errorHandler';

export default function ForgotPasswordForm() {
  const router = useRouter();

  const { sendPasswordResetOTP, isSendingOTP } = useAuthStore();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = sendOTPSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      await sendPasswordResetOTP(email);
      router.push('/verify-otp?email=' + encodeURIComponent(email));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AuthCard
      header={
        <AuthHeader
          icon={ShieldCheck}
          title="Reset Your Password"
          subtitle="Enter your email address and we will send you an OTP to reset your password."
          error={error}
        />
      }
      footer={
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Login
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
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          disabled={isSendingOTP}
          placeholder="Enter your email address"
          error={error && error.includes('email') ? error : undefined}
        />

        <button
          type="submit"
          disabled={isSendingOTP}
          className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold transition flex items-center justify-center ${
            isSendingOTP
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
          }`}
        >
          {isSendingOTP ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2" size={20} />
              Sending OTP...
            </>
          ) : (
            'Send OTP'
          )}
        </button>
      </form>
    </AuthCard>
  );
}
