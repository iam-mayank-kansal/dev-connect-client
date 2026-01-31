import { create } from 'zustand';
import axios from 'axios';
import { userAPI } from '@/lib/api/handlers/user';
import { UserStore } from './types';
import { User } from '@/lib/types/entities';

export const useUserStore = create<UserStore>((set) => ({
  profileUser: null,
  connectionStatus: null,
  isLoadingProfile: false,
  error: null,

  fetchUserProfile: async (userId: string) => {
    set({ isLoadingProfile: true, error: null });
    try {
      const data = await userAPI.getUserProfile(userId);

      set({
        profileUser: data.user,
        connectionStatus: data.status,
        isLoadingProfile: false,
      });
    } catch (error: unknown) {
      // // console.error('Store Error:', error);
      let errorMessage = 'Failed to load profile';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({
        profileUser: null,
        connectionStatus: null,
        error: errorMessage,
        isLoadingProfile: false,
      });
    }
  },

  clearProfile: () =>
    set({ profileUser: null, connectionStatus: null, error: null }),

  setProfileUser: (user: User) => set({ profileUser: user }),

  setConnectionStatus: (
    status:
      | 'self'
      | 'connected'
      | 'requestSent'
      | 'requestReceived'
      | 'blocked'
      | 'ignored'
      | 'not_connected'
      | null
  ) => set({ connectionStatus: status }),
}));
