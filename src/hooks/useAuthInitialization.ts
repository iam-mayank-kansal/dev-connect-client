import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';

export function useAuthInitialization() {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { authUser } = useAuthStore();
  const { fetchUserProfile } = useUserStore();

  useEffect(() => {
    if (authUser?._id) {
      setIsAuthChecking(false);
      fetchUserProfile(authUser._id);
    } else {
      setIsAuthChecking(false);
    }
  }, [authUser?._id, fetchUserProfile]);

  return { isAuthChecking, authUser };
}
