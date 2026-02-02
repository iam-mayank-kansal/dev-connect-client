'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import { User, ImageIcon, VideoIcon, PenTool } from 'lucide-react';

interface CreatePostSectionProps {
  profileUser?: {
    profilePicture?: string;
  } | null;
  onCreateClick: () => void;
  isValidImageUrl: (url: string) => boolean;
}

const CreatePostSection: FC<CreatePostSectionProps> = ({
  profileUser,
  onCreateClick,
  isValidImageUrl,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Post Input Row */}
      <div className="flex items-center gap-3 mb-4">
        {profileUser?.profilePicture &&
        isValidImageUrl(profileUser?.profilePicture) ? (
          <Image
            src={profileUser?.profilePicture}
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-border/50"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-border/50">
            <User size={18} className="text-muted-foreground" />
          </div>
        )}
        <input
          type="text"
          placeholder="Share an idea or ask a question..."
          className="flex-1 bg-muted/50 border border-border rounded-full px-5 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer hover:bg-muted/70"
          onClick={onCreateClick}
          readOnly
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 flex-1 px-3 py-2.5 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all text-sm font-medium group"
        >
          <ImageIcon
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="hidden sm:inline">Photo</span>
        </button>
        <button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 flex-1 px-3 py-2.5 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all text-sm font-medium group"
        >
          <VideoIcon
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="hidden sm:inline">Video</span>
        </button>
        <button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 flex-1 px-3 py-2.5 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all text-sm font-medium group"
        >
          <PenTool
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="hidden sm:inline">Write</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePostSection;
