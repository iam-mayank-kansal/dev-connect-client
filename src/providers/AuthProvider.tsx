'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * AuthProvider - Initializes authentication ONCE when the app starts
 * This ensures we check auth only once at startup, not on every route change
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Call checkAuth only once on app startup
    checkAuth();
  }, []); // Empty dependency - runs only once

  return <>{children}</>;
}
