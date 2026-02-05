'use client';

import React, { FC, useEffect, useState } from 'react';
import { blogService } from '@/services/blog/blogService';
import { Blog } from '@/lib/types/blog';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface UserBlogsSliderProps {
  userId: string;
}

const UserBlogsSlider: FC<UserBlogsSliderProps> = ({ userId }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogService.getUserBlogs(userId, 1, 3);

        const sortedBlogs = response.blogs
          .sort(
            (a: Blog, b: Blog) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);

        setBlogs(sortedBlogs);
      } catch (error) {
        console.error('Error fetching user blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserBlogs();
    }
  }, [userId]);

  const getImageUrl = (
    photo: string | { url?: string; fileId?: string } | undefined
  ): string | null => {
    if (!photo) return null;

    // If it's already a URL (from ImageKit)
    if (
      typeof photo === 'string' &&
      (photo.startsWith('http') || photo.startsWith('/'))
    ) {
      return photo;
    }

    // If it's an object with url property
    if (typeof photo === 'object' && photo?.url) {
      return photo.url;
    }

    return null;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
        <p className="text-gray-600">Loading blogs...</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>No blogs yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            href={`/blog/${blog._id}`}
            className="block h-full"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col border border-gray-200 hover:border-blue-400">
              {/* Blog Image */}
              {blog?.blogPhoto &&
                Array.isArray(blog.blogPhoto) &&
                blog.blogPhoto.length > 0 && (
                  <div className="relative w-full h-40 bg-gray-200 flex-shrink-0">
                    {getImageUrl(blog.blogPhoto[0]) ? (
                      <Image
                        src={getImageUrl(blog.blogPhoto[0])!}
                        alt={blog.blogTitle}
                        fill
                        className="object-cover pointer-events-none"
                        unoptimized
                      />
                    ) : null}
                  </div>
                )}

              {/* Blog Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
                  {blog.blogTitle}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                  {blog.blogBody}
                </p>
                <div className="text-xs text-gray-500 mt-3">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show All Button */}
      <div className="flex justify-center mt-6">
        <Link href={`/blogs/${userId}`}>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
            Show All Blogs
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserBlogsSlider;
