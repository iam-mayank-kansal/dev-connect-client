'use client';
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { ShieldCheck, Mail, Key, ArrowLeft } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyOtp } from "@/lib/api";

// This wrapper component and Suspense boundary fix the "useSearchParams" server-side rendering error.
// The actual logic is moved to VerifyOtpContent.
export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}

// Your original component with fixes to use Next.js navigation hooks correctly.
function VerifyOtpContent() {
  // Use `useSearchParams` and `useRouter` hooks, as they are the correct way to handle client-side
  // state and navigation within the Next.js App Router, particularly with the `Suspense` boundary.
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    const response = await verifyOtp(email, otp);
    console.log(response.data);

    setIsSubmitted(true);
    router.push(`/new-password?token=${encodeURIComponent(response.data.data.token)}`);
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    setError(error?.response?.data?.message || "OTP verification failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="min-h-screen text-black flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <ShieldCheck size={32} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your OTP</h1>
          <p className="text-gray-600">
            {isSubmitted
              ? `OTP verified successfully for ${email}`
              : 'Enter the OTP sent to your email along with your email address.'
            }
          </p>
          {error && <p className="text-red-600 mt-3 font-semibold">{error}</p>}
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  disabled={!!emailFromQuery || isLoading}
                />
              </div>
            </div>

            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block mb-2 font-medium text-gray-700">OTP</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={20} className="text-gray-400" />
                </div>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter your 6-digit OTP"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full cursor-pointer py-3 bg-blue-600 text-white rounded-lg font-semibold transition flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-md'}`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </>
              ) : "Verify OTP"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
              <ShieldCheck size={32} className="text-blue-600" />
            </div>
            <p className="text-gray-600">
              Your OTP has been verified successfully. You can now proceed to reset your password.
            </p>
            {/* Using Next.js Link for client-side navigation */}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Back to Login
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          {/* Using Next.js Link for client-side navigation */}
          <Link href="/forgot-password" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} className="mr-1" />
            Change Email
          </Link>
        </div>
      </div>
    </main>
  );
}
