'use client';
import { getUserProfileById } from '@/lib/api';
import { UserProfile } from '@/lib/types/user';
import { useEffect, useState } from 'react';

const useUserProfile = (userId: string | undefined) => {
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  // --- ADDED: State for connection status ---
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🔍 [useUserProfile] Fetching profile for userId:', userId);

  useEffect(() => {
    if (!userId) {
      console.log('❌ [useUserProfile] No user ID provided');
      setIsLoading(false);
      setError('No user ID provided.');
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(
          '🚀 [useUserProfile] Calling getUserProfileById with:',
          userId
        );
        const response = await getUserProfileById(userId);

        console.log('📦 [useUserProfile] Full API Response:', response);
        console.log('📊 [useUserProfile] Response data:', response.data);
        console.log(
          '🔎 [useUserProfile] Response data.data:',
          response.data?.data
        );
        console.log('📋 [useUserProfile] Response status:', response.status);

        // Handle different possible response structures
        let userData;
        // --- MODIFIED: To capture status ---
        let statusData;

        if (response.data && response.data.data) {
          console.log('✅ [useUserProfile] Using response.data.data structure');
          statusData = response.data.data.status; // Capture status
          if (response?.data?.data?.user) {
            console.log(
              '✅ [useUserProfile] Found `user` key inside data, extracting it.'
            );
            userData = response?.data?.data?.user; // This is the actual user profile
          } else {
            console.log(
              '⚠️ [useUserProfile] No `user` key found, using response.data.data directly.'
            );
            userData = response.data.data;
          }
        } else if (response.data) {
          console.log('✅ [useUserProfile] Using response.data structure');
          userData = response.data;
        } else {
          console.log('✅ [useUserProfile] Using response directly');
          userData = response;
        }

        if (userData) {
          console.log('🎯 [useUserProfile] Setting user data:', userData);
          console.log('🎯 [useUserProfile] Setting status:', statusData);
          setProfileUser(userData);
          setConnectionStatus(statusData); // Set the status
        } else {
          console.log('❌ [useUserProfile] No user data found in response');
          throw new Error('Invalid profile data structure received.');
        }
      } catch (err) {
        console.error('💥 [useUserProfile] Error fetching profile:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Profile not found or failed to load.'
        );
      } finally {
        console.log('🏁 [useUserProfile] Loading complete');
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // --- MODIFIED: Return connectionStatus ---
  return { profileUser, connectionStatus, isLoading, error };
};

export default useUserProfile;
