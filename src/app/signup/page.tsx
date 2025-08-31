'use client';

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function signUpUser() {
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-blue-50">
            <form className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm space-y-6 text-black">
                <h1 className="text-2xl font-bold text-blue-700 mb-2 text-center">Create Your Account</h1>
                <div>
                    <label htmlFor="name" className="block mb-1 font-medium text-blue-900">Name</label>
                    <input
                        id="name"
                        type="text"
                        required
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        autoComplete="name"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block mb-1 font-medium text-blue-900">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1 font-medium text-blue-900">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                </div>
                <button
                    onClick={()=>signUpUser()}
                    className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                >
                    Signup
                </button>
                <p className="text-sm text-center text-black">
                    Already have an account?
                    <Link href="/login" className="text-blue-600 hover:underline ml-1">Login</Link>
                </p>
            </form>
        </main>
    );
}
