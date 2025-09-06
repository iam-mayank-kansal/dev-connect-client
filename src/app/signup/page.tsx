'use client';
import Link from "next/link";
import { useState, FormEvent } from "react";
import axios, { AxiosError, AxiosResponse } from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { SignUpResponse } from "@/utils/interface";

export default function SignupPage() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function signUpUser(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);

    try {
      const response: AxiosResponse<SignUpResponse> = await axios.post('http://localhost:8080/devconnect/auth/sign-up', {
        name,
        email,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message || 'Signup successful!');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        toast.error(response.data.message || 'An error occurred.');
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;

      if (err.response) {
        toast.error(err.response.data?.message || 'An error occurred.');
      } else if (err.request) {
        toast.error('Network error. Please try again.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-black">
      <Toaster position="top-center" />
      <form
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-6 border border-gray-100"
        onSubmit={signUpUser}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Sign up to start using DevConnect</p>
        </div>

        <div>
          <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Enter a secure password"
          />
        </div>

        <button
          type="submit"
          className={`w-full cursor-pointer py-3 bg-blue-600 text-white rounded-lg font-semibold transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-md'}`}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline ml-1">
              Login
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
