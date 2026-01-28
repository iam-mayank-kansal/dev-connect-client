'use client';

import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
            <AlertCircle className="w-20 h-20 text-red-500 relative" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-white mb-2 tracking-tight">
          404
        </h1>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>

        {/* Error Description */}
        <p className="text-gray-400 mb-8 leading-relaxed">
          Sorry, the page you&apos;re looking for doesn&apos;t exist. It might
          have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Home size={18} />
            Home
          </Link>
        </div>

        {/* Additional Help Text */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-500 mb-4">Need help?</p>
          <Link
            href="/documentation"
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            Check our documentation →
          </Link>
        </div>
      </div>
    </div>
  );
}
