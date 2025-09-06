'use client';
import Link from "next/link";
import { useState, FormEvent } from "react";
import axios, { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Router } from 'lucide-react';
import { LoginResponse } from "@/utils/interface";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>('iam.mayank.kansal.01@gmail.com');
  const [password, setPassword] = useState<string>('Mayank@1234');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string, password?: string }>({});

  const router = useRouter()

  const validateForm = () => {
    const newErrors: { email?: string, password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function loginUser(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setLoading(true);

    try {
      const response: AxiosResponse<LoginResponse> = await axios.post('http://localhost:8080/devconnect/auth/login', {
        email,
        password,
      }, {
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || 'Login successful!');
        setEmail('');
        setPassword('');
        router.push('/');

      } else {
        toast.error(response.data.message || 'Login failed.');
      }

    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || 'Login error occurred.');
      } else if (error.request) {
        toast.error('Network error. Please try again.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen  items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-black">
      <form
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-6 border border-gray-100"
        onSubmit={loginUser}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your DevConnect account</p>
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              required
              className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300`}
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              autoComplete="email"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300`}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-700 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.password}
            </p>
          )}
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
          className={`w-full cursor-pointer py-3 bg-blue-600 text-white rounded-lg font-semibold transition 
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-md'}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 font-semibold hover:underline ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}