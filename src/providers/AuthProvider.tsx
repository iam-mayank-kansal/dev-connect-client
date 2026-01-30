'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * AuthProvider - Initializes authentication ONCE when the app starts
 * Restores token from localStorage if available (important for cross-domain production)
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Restore token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('devconnect-auth-token');
      if (token) {
        // Token exists in localStorage, verify it's still valid
        checkAuth();
      }
    }
  }, [checkAuth]);

  return <>{children}</>;
}
