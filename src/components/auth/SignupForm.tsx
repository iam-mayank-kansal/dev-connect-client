'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

// Hooks & Stores
import { useAuthStore } from '@/store/useAuthStore';
import {
  signUpSchema,
  SignUpFormData,
  SignUpFormErrors,
} from '@/lib/validation/auth';

// Components
import { AuthInput } from '@/components/ui/AuthInput';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { getErrorMessage } from '@/lib/utils/errorHandler';

export function SignupForm() {
  const router = useRouter();
  const { signUp, isSigningUp } = useAuthStore();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<SignUpFormErrors>({});

  const validate = (): boolean => {
    const result = signUpSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: SignUpFormErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof SignUpFormData;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await signUp(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: unknown) {
      const msg = getErrorMessage(error);
      toast.error(msg);
    }
  };

  return (
    <form
      className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-6 border border-gray-100"
      onSubmit={handleSubmit}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">Join the DevConnect community</p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <AuthInput
          id="name"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          icon={User}
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          error={errors.name}
        />

        {/* Email */}
        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          error={errors.email}
        />

        {/* Password */}
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            // Clear both password related errors on change
            const newErrors = { ...errors };
            delete newErrors.password;
            delete newErrors.confirmPassword;
            setErrors(newErrors);
          }}
          error={errors.password}
        />

        {/* Confirm Password */}
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => {
            setFormData({ ...formData, confirmPassword: e.target.value });
            if (errors.confirmPassword)
              setErrors({ ...errors, confirmPassword: undefined });
          }}
          error={errors.confirmPassword}
        />
      </div>

      <button
        type="submit"
        disabled={isSigningUp}
        className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold transition-all
          ${
            isSigningUp
              ? 'opacity-70 cursor-wait'
              : 'hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
          }`}
      >
        {isSigningUp ? 'Creating Account...' : 'Sign Up'}
      </button>

      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}
