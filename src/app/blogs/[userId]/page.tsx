'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Blog } from '@/lib/types/blog';
import { blogService } from '@/services/blog/blogService';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, ChevronLeft } from 'lucide-react';
import { sortBlogsByDate } from '@/lib/utils/blog';
import { getErrorMessage } from '@/lib/utils/errorHandler';

export default function UserBlogsFeed() {
  const params = useParams();
  const userId = params.userId as string;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  // Fetch user's blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await blogService.getUserBlogs(userId, 1, 10);
        const sortedBlogs = sortBlogsByDate(response.blogs);
        setBlogs(sortedBlogs);
        setCurrentPage(1);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        setError(getErrorMessage(err));
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserBlogs();
    }
  }, [userId]);

  // Load more blogs
  const loadMoreBlogs = useCallback(async () => {
    if (isLoadingMore || currentPage >= totalPages) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await blogService.getUserBlogs(userId, nextPage, 10);
      const newBlogs = sortBlogsByDate(response.blogs);
      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more blogs:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, currentPage, totalPages, userId]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingMore &&
          currentPage < totalPages
        ) {
          loadMoreBlogs();
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [isLoadingMore, currentPage, totalPages, loadMoreBlogs]);

  const getImageUrl = (
    photo: string | { url?: string; fileId?: string } | undefined
  ): string | null => {
    if (!photo) return null;
    if (
      typeof photo === 'string' &&
      (photo.startsWith('http') || photo.startsWith('/'))
    ) {
      return photo;
    }
    if (typeof photo === 'object' && photo?.url) {
      return photo.url;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Go Back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No blogs found</p>
          <Link href="/">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Go Back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft size={20} />
              Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex-1">
            User Blogs
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blog/${blog._id}`}
              className="block h-full"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col border border-gray-100 hover:border-blue-400 hover:-translate-y-1">
                {/* Blog Image */}
                {blog?.blogPhoto &&
                  Array.isArray(blog.blogPhoto) &&
                  blog.blogPhoto.length > 0 && (
                    <div className="relative w-full h-48 bg-gray-200 flex-shrink-0">
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
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2">
                    {blog.blogTitle}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                    {blog.blogBody}
                  </p>

                  {/* Reactions */}
                  <div className="flex gap-4 mt-3 text-xs text-gray-500 border-t border-gray-200 pt-3">
                    <span>👍 {blog.reactions?.agreed?.length || 0}</span>
                    <span>👎 {blog.reactions?.disagreed?.length || 0}</span>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="flex justify-center mt-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={observerTarget} className="mt-8 text-center">
          {currentPage >= totalPages && blogs.length > 0 && (
            <p className="text-gray-500">No more blogs to load</p>
          )}
        </div>
      </div>
    </div>
  );
}
