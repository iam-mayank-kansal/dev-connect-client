'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';

interface ProfileSidebarProps {
  profileUser?: {
    _id: string;
    name?: string;
    profilePicture?: string;
    designation?: string;
    connections?: {
      connected: string[];
    };
    blogs?: string[];
  } | null;
  authUser?: {
    _id: string;
    name?: string;
    designation?: string;
  };
  isValidImageUrl: (url: string) => boolean;
}

const ProfileSidebar: FC<ProfileSidebarProps> = ({
  profileUser,
  authUser,
  isValidImageUrl,
}) => {
  return (
    <aside className="hidden md:block md:col-span-1">
      <div className="bg-card border border-border rounded-2xl overflow-hidden sticky top-20 shadow-md hover:shadow-lg transition-all duration-300">
        {/* Avatar Section */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex justify-center">
            {profileUser?.profilePicture &&
            isValidImageUrl(profileUser?.profilePicture) ? (
              <Image
                src={profileUser?.profilePicture}
                alt="Profile"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20 shadow-lg">
                <User size={40} className="text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center px-5 pb-5 border-b border-border/50">
          <h3 className="font-bold text-foreground text-lg line-clamp-2">
            {profileUser?.name || authUser?.name || 'User'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-1">
            {profileUser?.designation || authUser?.designation || 'Developer'}
          </p>
        </div>

        {/* Stats Section */}
        <div className="p-5 space-y-3 border-b border-border/50">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-400/5 border border-blue-500/10 hover:border-blue-500/20 transition-all group cursor-default">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Connections
            </span>
            <span className="text-xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
              {profileUser?.connections?.connected?.length || 0}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-400/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-all group cursor-default">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Posts
            </span>
            <span className="text-xl font-bold text-emerald-600 group-hover:scale-110 transition-transform">
              {profileUser?.blogs?.length || 0}
            </span>
          </div>
        </div>

        {/* View Profile Button */}
        <div className="p-5">
          <Link
            href={`/profile/${profileUser?._id || authUser?._id}`}
            className="w-full py-3 px-4 text-center text-sm font-semibold text-background bg-foreground rounded-xl hover:bg-foreground/90 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 block"
          >
            View Profile
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
