'use client';
import React, { FC } from 'react';
import { PopulatedUser } from '@/lib/types/blog';
import Image from 'next/image';
import { formatDate } from '@/utils/helper/formDate';
import Link from 'next/link';
import { User } from 'lucide-react';

interface CardHeaderProps {
  user: PopulatedUser;
  createdAt: string;
}

const CardHeader: FC<CardHeaderProps> = ({ user, createdAt }) => {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3 ">
        <Link href={`/profile/${user._id}`}>
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt="Profile"
              width={144}
              height={144}
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
              <User size={64} className="text-gray-400" />
            </div>
          )}
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
      </div>
    </div>
  );
};

export default CardHeader;
