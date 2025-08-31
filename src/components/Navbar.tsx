'use client';

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-600 shadow flex justify-between items-center py-4 px-8">
      <Link href="/" className="text-white text-xl font-bold tracking-wide">
        DevConnect
      </Link>
      <div className="flex gap-4">
        <Link href="/login" className="text-blue-600 bg-white rounded px-4 py-2 font-medium hover:bg-blue-50 border border-white hover:text-blue-700 transition">
          Login
        </Link>
        <Link href="/signup" className="bg-white text-blue-600 rounded px-4 py-2 font-medium border border-white hover:bg-blue-100 hover:text-blue-800 transition">
          Signup
        </Link>
      </div>
    </nav>
  );
}
