// useAuth - Custom Hook
// Provides convenient access to auth state and actions
// Note: Authentication is checked once by AuthProvider at app startup

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
  const router = useRouter();

  // Get all auth state and actions from store
  const {
    authUser,
    isCheckingAuth,
    isLoggingIn,
    isSigningUp,
    isLoggingOut,
    error,
    login,
    signUp,
    logout,
    sendPasswordResetOTP,
    verifyPasswordResetOTP,
    changePassword,
    clearError,
  } = useAuthStore();

  // Convenience flags
  const isAuthenticated = !!authUser;
  const isLoading =
    isCheckingAuth || isLoggingIn || isSigningUp || isLoggingOut;

  // Helper function: Login and redirect
  const loginAndRedirect = async (email: string, password: string) => {
    try {
      await login(email, password);
      router.push('/');
    } catch (error) {
      console.error('Login and redirect failed:', error);
    }
  };

  // Helper function: Sign up and redirect
  const signUpAndRedirect = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      await signUp(name, email, password);
      router.push('/');
    } catch (error) {
      console.error('Sign up and redirect failed:', error);
    }
  };

  // Helper function: Logout and redirect
  const logoutAndRedirect = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout and redirect failed:', error);
    }
  };

  return {
    // State
    authUser,
    isAuthenticated,
    isLoading,
    isCheckingAuth,
    isLoggingIn,
    isSigningUp,
    isLoggingOut,
    error,

    // Actions
    login,
    loginAndRedirect,
    signUp,
    signUpAndRedirect,
    logout,
    logoutAndRedirect,
    sendPasswordResetOTP,
    verifyPasswordResetOTP,
    changePassword,
    clearError,
    checkAuth,
  };
}
