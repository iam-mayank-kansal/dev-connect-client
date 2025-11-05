'use client';

import React, { FC } from 'react';
// Removed MoreHorizontal import
import { PopulatedUser } from '@/lib/types/blog';
import Image from 'next/image';
import { getMediaUrl } from '@/utils/helper/getMediaUrl-blog';
import { formatDate } from '@/utils/helper/formDate';
import Link from 'next/link';

interface CardHeaderProps {
  user: PopulatedUser;
  createdAt: string;
}

const CardHeader: FC<CardHeaderProps> = ({ user, createdAt }) => {
  const userProfilePic = user.profilePicture
    ? getMediaUrl(user.profilePicture, 'profilePicture')
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e9d5ff&color=7c3aed`;

  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3 ">
        <Link href={`/profile/${user._id}`}>
          <Image
            src={userProfilePic}
            width={44}
            height={44}
            alt={`${user.name}'s profile`}
            className="w-11 h-11 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link href={`/profile/${user._id}`}>
            <p className="font-semibold text-gray-800">
              {user.name || 'Anonymous'}
            </p>
          </Link>
          <p className="text-sm text-gray-500">
            {user.designation || 'Developer'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-gray-500">
        <time className="text-xs">{formatDate(createdAt)}</time>
        {/* --- Removed 3-dot menu button --- */}
      </div>
    </div>
  );
};

export default CardHeader;
