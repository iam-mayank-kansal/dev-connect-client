'use client';
import { useUser } from '@/utils/context/user-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useUserProfile from './useUserProfile';
import Loader from '@/utils/helper/Loader';
import ErrorMessageDisplay from '@/utils/helper/ErrorMessageDisplay';
import UserProfileView from './UserProfileView';
import UserProfileEdit from './UserProfileEdit';

const UserProfileContainer = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  console.log('👤 [UserProfileContainer] Current userId prop:', userId);

  // Get the currently logged-in user
  const { user: currentUser, isLoading: isAuthLoading } = useUser();

  console.log('🔐 [UserProfileContainer] Auth state:', {
    isAuthLoading,
    currentUser: currentUser ? 'Logged in' : 'Not logged in',
    currentUserId: currentUser?._id,
  });

  // --- MODIFIED: Get connectionStatus from hook ---
  const {
    profileUser,
    connectionStatus, // Added this
    isLoading: isProfileLoading,
    error,
  } = useUserProfile(userId);

  console.log('📊 [UserProfileContainer] Profile state:', {
    isProfileLoading,
    profileUser: profileUser ? 'Loaded' : 'Not loaded',
    connectionStatus, // Added this
    error,
  });

  // Handle redirection if user is not logged in
  useEffect(() => {
    console.log('🔄 [UserProfileContainer] Checking auth...');
    if (!isAuthLoading && !currentUser) {
      console.log('🚫 [UserProfileContainer] No user, redirecting to login');
      router.push('/login');
    } else if (currentUser) {
      console.log(
        '✅ [UserProfileContainer] User authenticated:',
        currentUser._id
      );
    }
  }, [isAuthLoading, currentUser, router]);

  // Show loading spinner while auth or profile data is loading
  if (isAuthLoading || isProfileLoading) {
    console.log('⏳ [UserProfileContainer] Showing loader');
    return <Loader />;
  }

  // Handle profile not found error
  if (error) {
    console.log('❌ [UserProfileContainer] Showing error:', error);
    return <ErrorMessageDisplay message={error} />;
  }

  // Handle cases where user isn't logged in or profile data couldn't be loaded
  if (!currentUser || !profileUser || !connectionStatus) {
    // Added connectionStatus check
    console.log(
      '⚠️ [UserProfileContainer] No current user, profile user, or status, showing loader'
    );
    return <Loader />;
  }

  // Check if the logged-in user is the owner of this profile
  // The API status 'self' is also a good check
  const isOwner =
    currentUser._id === profileUser._id || connectionStatus === 'self';

  console.log('👑 [UserProfileContainer] Ownership check:', {
    currentUserId: currentUser._id,
    profileUserId: profileUser._id,
    connectionStatus,
    isOwner,
  });

  console.log('🎬 [UserProfileContainer] Rendering profile view');

  if (isOwner && isEditing) {
    // If they are the owner and clicked "Edit", show the edit component
    return (
      <UserProfileEdit
        user={profileUser}
        onSaveSuccess={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Otherwise, show the view-only component
  // --- MODIFIED: Pass connectionStatus prop ---
  return (
    <UserProfileView
      user={profileUser}
      isOwner={isOwner}
      onEditClick={() => setIsEditing(true)}
      connectionStatus={connectionStatus}
    />
  );
};

export default UserProfileContainer;
