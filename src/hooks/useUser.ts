'use client';
import { userService } from '@/services/user/userService';
import { useState } from 'react';

export function useAuth() {
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  // ACTIONS
  const getUserProfile = async (id: string) => {
    setIsFetchingUser(true);
    try {
      const { user, status } = await userService.getUserProfile(id);
      return { user, status };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    } finally {
      setIsFetchingUser(false);
    }
  };

  return {
    // state
    isFetchingUser,
    // actions
    getUserProfile,
  };
}
