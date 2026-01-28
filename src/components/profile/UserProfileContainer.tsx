'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import Loader from '@/utils/helper/Loader';
import ErrorMessageDisplay from '@/utils/helper/ErrorMessageDisplay';
import UserProfileView from './UserProfileView';
import UserProfileEdit from './UserProfileEdit';
import { User as UserEntity } from '@/lib/types/entities';

const UserProfileContainer = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // 1. Get Logged In User (Me)
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  // 2. Get Visited Profile (Them)
  const {
    profileUser,
    connectionStatus,
    isLoadingProfile,
    error,
    fetchUserProfile,
    clearProfile,
    setProfileUser,
  } = useUserStore();

  // 3. Fetch Data on Mount or ID Change
  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
    // Cleanup when leaving page
    return () => clearProfile();
  }, [userId, fetchUserProfile, clearProfile]);

  // 4. Handle Auth Redirects
  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      router.push('/login');
    }
  }, [isCheckingAuth, authUser, router]);

  // 5. Loading & Error States
  if (isCheckingAuth || isLoadingProfile) return <Loader />;
  if (error) return <ErrorMessageDisplay message={error} />;
  if (!profileUser || !authUser) return <Loader />;

  // 6. Ownership Check
  const isOwner =
    authUser._id === profileUser._id || connectionStatus === 'self';

  // 7. Render Logic
  if (isOwner && isEditing) {
    return (
      <UserProfileEdit
        user={profileUser}
        onSaveSuccess={(updatedUser: UserEntity) => {
          if (setProfileUser) {
            setProfileUser(updatedUser);
          } else {
            fetchUserProfile(userId || authUser._id);
          }
          checkAuth();
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <UserProfileView
      user={profileUser}
      isOwner={isOwner}
      onEditClick={() => setIsEditing(true)}
      connectionStatus={connectionStatus || 'not_connected'}
    />
  );
};

export default UserProfileContainer;
