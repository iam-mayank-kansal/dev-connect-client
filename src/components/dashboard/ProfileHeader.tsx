'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Edit, User } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import { UserProfile } from '@/lib/types/user';

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwner: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ profile, isOwner }) => {
  const router = useRouter();
  const profileImageSrc = profile.profilePicture
    ? getImageUrl(profile.profilePicture, 'profilePicture')
    : '';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="flex-shrink-0">
          {profileImageSrc ? (
            <Image
              src={profileImageSrc}
              alt={`${profile.name}'s profile`}
              width={128}
              height={128}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white ring-2 ring-blue-500"
            />
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white ring-2 ring-gray-300">
              <User size={48} className="text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
          {profile.designation && (
            <p className="text-lg text-gray-600 mt-1">{profile.designation}</p>
          )}
          {profile.bio && (
            <p className="text-gray-700 mt-4 max-w-xl mx-auto sm:mx-0">
              {profile.bio}
            </p>
          )}
        </div>
        {isOwner && (
          <div className="flex-shrink-0 mt-4 sm:mt-0">
            <button
              onClick={() => router.push('/profile/edit')} // Navigate to the dedicated edit page
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={18} />
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
