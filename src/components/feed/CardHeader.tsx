'use client';
import React, { FC } from 'react';
import { PopulatedUser } from '@/lib/types/blog';
import Image from 'next/image';
import { formatDate } from '@/lib/utils/dateFormatter';
import Link from 'next/link';
import { User } from 'lucide-react';

interface CardHeaderProps {
  user: PopulatedUser;
  createdAt: string;
}

const CardHeader: FC<CardHeaderProps> = ({ user, createdAt }) => {
  return (
    <div className="p-4 flex items-center justify-between border-b border-border/40">
      <div className="flex items-center space-x-3">
        <Link href={`/profile/${user._id}`}>
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt="Profile"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border-2 border-border shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-border shadow-sm">
              <User size={20} className="text-muted-foreground" />
            </div>
          )}
        </Link>

        <div>
          <Link href={`/profile/${user._id}`}>
            <p className="font-semibold text-foreground text-sm hover:text-primary transition-colors">
              {user.name || 'Anonymous'}
            </p>
          </Link>
          <p className="text-xs text-muted-foreground">
            {user.designation || 'Developer'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-muted-foreground">
        <time className="text-xs">{formatDate(createdAt)}</time>
      </div>
    </div>
  );
};

export default CardHeader;
