"use client";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { AxiosError } from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { signUpUserApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react'; // 👈 Added icons

export default function SignupPage() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false); // 👈 Added state for password visibility
    const [errors, setErrors] = useState<{ name?: string, email?: string, password?: string }>({}); // 👈 Added state for errors

    const router = useRouter();

    const validateForm = () => {
        const newErrors: { name?: string, email?: string, password?: string } = {};

        if (!name) {
            newErrors.name = 'Name is required';
        }

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

    async function signUpUser(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await signUpUserApi(name, email, password);

            if (response.status === 201 || response.status === 200) {
                toast.success(response.data.message || "Signup successful!");
                setName("");
                setEmail("");
                setPassword("");
                router.push("/login")
            } else {
                toast.error(response.data.message || "An error occurred.");
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;

            if (err.response) {
                toast.error(err.response.data?.message || "An error occurred.");
            } else if (err.request) {
                toast.error("Network error. Please try again.");
            } else {
                toast.error("An unexpected error occurred.");
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
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                        </div>
                        <input
                            id="name"
                            type="text"
                            required
                            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                            value={name}
                            onChange={e => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: undefined });
                            }}
                            autoComplete="name"
                            placeholder="Enter your full name"
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email Address</label>
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
                            type={showPassword ? "text" : "password"} // 👈 Toggle password type
                            required
                            className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: undefined });
                            }}
                            autoComplete="new-password"
                            placeholder="Enter a secure password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-700 focus:outline-none"
                            onClick={() => setShowPassword((prev) => !prev)} // 👈 Toggle password visibility
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
