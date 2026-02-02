'use client';

import React, { FC } from 'react';
import { Loader2, ServerCrash } from 'lucide-react';
import BlogPostCard from './BlogPostCard';
import { Blog } from '@/lib/types/blog';

interface FeedContentProps {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  isLoadingMore?: boolean;
  observerTarget?: React.RefObject<HTMLDivElement | null>;
}

const FeedContent: FC<FeedContentProps> = ({
  blogs,
  loading,
  error,
  isLoadingMore,
  observerTarget,
}) => {
  if (loading) {
    return (
      <div className="text-center text-muted-foreground mt-16">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading Feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive bg-destructive/10 p-6 rounded-lg mt-16 border border-destructive/20">
        <ServerCrash className="w-10 h-10 mx-auto mb-3" />
        <p className="font-semibold">Error Loading Posts</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-16 border-2 border-dashed border-border p-10 rounded-lg bg-muted/30">
        <h2 className="text-xl font-bold text-foreground mb-2">
          The Feed is Quiet
        </h2>
        <p className="text-sm">Be the first to share your story!</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {blogs.map((blog, index) => (
        <BlogPostCard key={blog._id || index} blog={blog} />
      ))}

      {/* Intersection observer target for infinite scroll */}
      <div ref={observerTarget} className="py-8 flex justify-center">
        {isLoadingMore && (
          <div className="text-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading more posts...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedContent;
