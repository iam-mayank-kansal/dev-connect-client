'use client';

import React, { FC } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { PopulatedUser } from '@/lib/types/blog';
import { formatDate, getMediaUrl } from '@/utils/helper/blog';
import Image from 'next/image';

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
      <div className="flex items-center space-x-3">
        <Image src={userProfilePic} width={44} height={44} alt={`${user.name}'s profile`} className="w-11 h-11 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-gray-800">{user.name || 'Anonymous'}</p>
          <p className="text-sm text-gray-500">{user.designation || 'Developer'}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-gray-500">
        <time className="text-xs">{formatDate(createdAt)}</time>
        <button className="hover:bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

export default CardHeader;