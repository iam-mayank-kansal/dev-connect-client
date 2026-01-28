'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error occurred:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
            <AlertTriangle className="w-20 h-20 text-yellow-500 relative" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-white mb-2">Oops!</h1>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Something went wrong
        </h2>

        {/* Error Description */}
        <p className="text-gray-400 mb-8 leading-relaxed">
          We encountered an unexpected error. Please try again or contact
          support if the problem persists.
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-xs text-red-400 text-left break-words font-mono">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Home size={18} />
            Home
          </Link>
        </div>

        {/* Digest for tracking */}
        {error.digest && (
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Error ID:{' '}
              <span className="text-gray-400 font-mono">{error.digest}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
