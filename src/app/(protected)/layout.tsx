'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authUser, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  // Log initial mount
  useEffect(() => {
    console.log('[ProtectedLayout] Component mounted');
  }, []);

  // Log auth state changes and handle redirects
  useEffect(() => {
    console.log('[ProtectedLayout] Auth state changed:', {
      isCheckingAuth,
      hasAuthUser: !!authUser,
      authUser: authUser
        ? {
            _id: authUser._id,
            email: authUser.email,
            // Add other non-sensitive fields you want to log
          }
        : null,
      timestamp: new Date().toISOString(),
    });

    // Only redirect if we're done checking AND user is not authenticated
    if (!isCheckingAuth && !authUser) {
      console.warn(
        '[ProtectedLayout] No authenticated user found, initiating redirect to /login'
      );
      router.push('/login');
    } else if (!isCheckingAuth && authUser) {
      console.log(
        '[ProtectedLayout] User authenticated successfully, rendering protected content'
      );
    } else if (isCheckingAuth) {
      console.log('[ProtectedLayout] Still checking authentication...');
    }
  }, [isCheckingAuth, authUser, router]);

  // ALWAYS show loading while checking auth - prevents flash and race condition
  if (isCheckingAuth) {
    console.log(
      '[ProtectedLayout] Rendering: Auth check in progress (loading state)'
    );
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If not checking anymore and no user, redirect is happening
  // Don't render children to prevent flash
  if (!authUser) {
    console.log('[ProtectedLayout] Rendering: Redirect in progress (no user)');
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  console.log(
    '[ProtectedLayout] Rendering: Protected content (user authenticated)'
  );
  return <div className="bg-gray-50">{children}</div>;
}
