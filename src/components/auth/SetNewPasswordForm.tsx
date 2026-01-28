'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// UI & Icons
import { KeyRound, Loader2, AlertCircle } from 'lucide-react';

// Store & Validation
import { useAuthStore } from '@/store/useAuthStore';
import {
  setNewPasswordSchema,
  SetNewPasswordFormData,
} from '@/lib/validation/auth';
import { AuthCard } from '../ui/AuthCard';
import { AuthHeader } from '../ui/AuthHeader';
import { PasswordInput } from '../ui/PasswordInput';

export default function SetNewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setNewPassword, isSettingNewPassword, resetToken } = useAuthStore();

  const [formData, setFormData] = useState<SetNewPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [missingTokenError, setMissingTokenError] = useState(false);

  const effectiveToken = searchParams.get('token') || resetToken;

  useEffect(() => {
    if (!effectiveToken) {
      setMissingTokenError(true);
    }
  }, [effectiveToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === 'newPassword' && errors.confirmPassword) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!effectiveToken) {
      setMissingTokenError(true);
      return;
    }

    const result = setNewPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await setNewPassword(effectiveToken, formData.newPassword);
      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  };

  // --- RENDER ERROR STATE (Missing Token) ---
  if (missingTokenError) {
    return (
      <AuthCard
        header={
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Invalid Session
            </h2>
            <p className="text-gray-600 text-sm">
              The password reset token is missing or expired. Please request a
              new code.
            </p>
          </div>
        }
      >
        <button
          onClick={() => router.push('/forgot-password')}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Back to Forgot Password
        </button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      header={
        <AuthHeader
          icon={KeyRound}
          title="Set New Password"
          subtitle="Create a strong password for your account."
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <PasswordInput
            id="newPassword"
            name="newPassword"
            label="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            disabled={isSettingNewPassword}
            placeholder="Enter new password"
            autoComplete="new-password"
          />

          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={isSettingNewPassword}
            placeholder="Confirm your new password"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={isSettingNewPassword}
          className={`w-full py-3 rounded-lg font-semibold text-white transition flex items-center justify-center ${
            isSettingNewPassword
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]'
          }`}
        >
          {isSettingNewPassword ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2" size={20} />
              Saving...
            </>
          ) : (
            'Save Password'
          )}
        </button>
      </form>
    </AuthCard>
  );
}
