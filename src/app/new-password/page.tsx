'use client';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react';
import { resetUserPassword } from "@/lib/api";

// A wrapper component to handle the Suspense boundary.
// This is required because useSearchParams is a client-side hook
// and Next.js's server-side rendering needs a fallback while it's hydrating.
export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <SetNewPasswordContent />
    </Suspense>
  );
}

// The main component containing the password reset logic.
function SetNewPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token.");
    }
  }, [token]);

  const validate = () => 
    {
    const validationErrors: typeof errors = {};
    if (!password) validationErrors.password = "Password is required";
    else if (password.length < 6) validationErrors.password = "Password must be at least 6 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      validationErrors.password = "Password must contain uppercase, lowercase and number";
    }

    if (password !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!token || typeof token !== 'string') {
      toast.error("Token missing. Cannot reset password.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetUserPassword(password, token);

      toast.success(res.data.message || "Password reset successfully!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;

      toast.error(
        error.response?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-black">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full space-y-6 border border-gray-100"
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <KeyRound size={32} className="text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Set New Password
            </h1>
            <p className="text-gray-600 mt-2">
              Create a strong, new password for your account
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className={`w-full border rounded-lg pl-10 pr-10 py-3 focus:outline-none ${errors.password ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-300`}
                placeholder="Enter new password"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 6 characters with uppercase, lowercase and number
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                className={`w-full border rounded-lg pl-10 pr-10 py-3 focus:outline-none ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-300`}
                placeholder="Confirm your new password"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-700 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition flex items-center justify-center ${loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Password'
            )}
          </button>
        </form>
      </main>
    </>
  );
}
