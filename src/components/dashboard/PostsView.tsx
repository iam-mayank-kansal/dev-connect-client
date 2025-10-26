'use client';

import React, { FC } from 'react';
import BlogPostCard from '@/components/feed/BlogPostCard'; // Re-use your existing card
import { Blog } from '@/lib/types/blog';
import { Loader2 } from 'lucide-react';

interface PostsViewProps {
  posts: Blog[];
  isLoading: boolean; // Accept the new loading prop
}

const PostsView: FC<PostsViewProps> = ({ posts, isLoading }) => {
  // Show a loader specific to this section
  if (isLoading) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
        <p>Loading posts...</p>
      </div>
    );
  }

  // Show the empty state only after loading is complete
  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 border-2 border-dashed p-10 rounded-lg">
        <h2 className="text-xl font-bold text-gray-700 mb-2">No Posts Yet</h2>
        <p>This user hasn&apos;t shared any posts.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {posts.map((post) => (
        <BlogPostCard key={post._id} blog={post} />
      ))}
    </div>
  );
};

export default PostsView;
