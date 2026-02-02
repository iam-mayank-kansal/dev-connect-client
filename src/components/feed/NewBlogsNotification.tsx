'use client';

import React, { FC } from 'react';
import { Loader2 } from 'lucide-react';

interface NewBlogsNotificationProps {
  newBlogCount: number;
  isRefetching: boolean;
  onViewLatest: () => void;
}

const NewBlogsNotification: FC<NewBlogsNotificationProps> = ({
  newBlogCount,
  isRefetching,
  onViewLatest,
}) => {
  return (
    <div className="sticky top-0 z-40 mb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-between border border-blue-400/30">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="font-semibold">
          {newBlogCount} new {newBlogCount === 1 ? 'blog' : 'blogs'} posted!
        </span>
      </div>
      <button
        onClick={onViewLatest}
        disabled={isRefetching}
        className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-lg text-sm font-semibold transition-all active:scale-95 flex items-center gap-2"
      >
        {isRefetching ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Loading...
          </>
        ) : (
          'View Latest'
        )}
      </button>
    </div>
  );
};

export default NewBlogsNotification;
