'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const router = useRouter();

  const memoizedCheckAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    memoizedCheckAuth();
  }, [memoizedCheckAuth]);

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      router.push('/login');
    }
  }, [isCheckingAuth, authUser, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
