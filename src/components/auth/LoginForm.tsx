'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';

// Hooks & Stores
import { useAuthStore } from '@/store/useAuthStore';
import {
  loginSchema,
  LoginFormData,
  LoginFormErrors,
} from '@/lib/validation/auth';

// Components
import { AuthInput } from '@/components/ui/AuthInput';
import { PasswordInput } from '@/components/ui/PasswordInput';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/error-handler';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validate = (): boolean => {
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: LoginFormErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof LoginFormData;
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
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
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
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your DevConnect account</p>
      </div>

      <div className="space-y-4">
        <AuthInput
          id="email"
          label="Email"
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

        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          error={errors.password}
        />
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoggingIn}
        className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold transition-all
          ${
            isLoggingIn
              ? 'opacity-70 cursor-wait'
              : 'hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
          }`}
      >
        {isLoggingIn ? 'Logging in...' : 'Login'}
      </button>

      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
