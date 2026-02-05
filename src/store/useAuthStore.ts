// store/useAuthStore.ts
import { create } from 'zustand';
import toast from 'react-hot-toast';
import { AuthStore } from './types';
import { authService } from '@/services/auth/authService';
import { getErrorMessage } from '@/lib/utils/errorHandler';
import { io } from 'socket.io-client';

export const useAuthStore = create<AuthStore>((set, get) => ({
  // ============= STATE =============
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  isLoggingOut: false,
  isSendingOTP: false,
  isVerifyingOTP: false,
  isChangingPassword: false,
  isSettingNewPassword: false,
  resetToken: null,
  socket: null,
  onlineUsers: [],

  error: null,

  // ============= ACTIONS =============

  // check auth
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const data = await authService.checkAuth();
      if (data) {
        set({
          authUser: data.user,
          error: null,
        });
        get().connectToSocket();
      } else {
        set({ authUser: null });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Authentication failed';
      set({ authUser: null });
      toast.error(`Auth check failed: ${errorMessage}`);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // login
  login: async (email: string, password: string) => {
    set({ isLoggingIn: true, error: null });
    try {
      const data = await authService.login(email, password);
      set({
        authUser: data.user,
        error: null,
      });
      get().connectToSocket();
      toast.success('Logged in successfully');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // signup
  signUp: async (name: string, email: string, password: string) => {
    set({ isSigningUp: true, error: null });
    try {
      const data = await authService.signUp(name, email, password);
      set({ authUser: data.user, error: null });
      get().connectToSocket();
      toast.success('Account created successfully');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // logout
  logout: async () => {
    set({ isLoggingOut: true, error: null });
    try {
      await authService.logout();
      set({
        authUser: null,
        error: null,
      });
      get().disconnectFromSocket();
      toast.success('Logged out successfully');
    } catch (error: unknown) {
      set({ authUser: null });
      toast.error('Failed to logout properly');
      throw error;
    } finally {
      set({ isLoggingOut: false });
    }
  },

  // send otp
  sendPasswordResetOTP: async (email: string) => {
    set({ isSendingOTP: true, error: null });
    try {
      await authService.sendPasswordResetOTP(email);
      toast.success('OTP sent to your email');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isSendingOTP: false });
    }
  },

  // verify otp
  verifyPasswordResetOTP: async (email: string, otp: string) => {
    set({ isVerifyingOTP: true, error: null });
    try {
      const data = await authService.verifyPasswordResetOTP(email, otp);
      set({ resetToken: data?.data?.token });
      toast.success('OTP verified successfully');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ resetToken: null });
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isVerifyingOTP: false });
    }
  },

  setNewPassword: async (resetToken: string, newPassword: string) => {
    set({ isSettingNewPassword: true, error: null });
    try {
      await authService.setNewPassword(resetToken, newPassword);
      set({ resetToken: null });
      toast.success('Password updated successfully. Please login.');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isSettingNewPassword: false });
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    set({ isChangingPassword: true, error: null });
    try {
      await authService.changePassword(currentPassword, newPassword);

      toast.success('Password changed successfully');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isChangingPassword: false });
    }
  },

  // when we login we need to connect to socket server
  connectToSocket: () => {
    if (get()?.socket?.connected || !get()?.authUser) return;

    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      query: {
        userId: get()?.authUser?._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // and when we logout we need to disconnect from socket server
  disconnectFromSocket: () => {
    if (get()?.socket?.connected) {
      get()?.socket?.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },

  clearError: () => set({ error: null }),
}));
