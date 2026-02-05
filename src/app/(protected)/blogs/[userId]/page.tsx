'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Blog } from '@/lib/types/blog';
import { blogService } from '@/services/blog/blogService';
import Image from 'next/image';
import { Loader2, ChevronLeft, ThumbsUp, ThumbsDown } from 'lucide-react';
import { sortBlogsByDate } from '@/lib/utils/blog';
import { getErrorMessage } from '@/lib/utils/errorHandler';

export default function UserBlogsFeed() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userName, setUserName] = useState<string>('');
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

        // Get user name from first blog's author
        if (
          sortedBlogs.length > 0 &&
          sortedBlogs[0].userId &&
          typeof sortedBlogs[0].userId === 'object'
        ) {
          setUserName(sortedBlogs[0].userId.name || '');
        }
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
          <p className="text-gray-600 text-lg">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-lg">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4 text-lg">No blogs found</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group mb-12"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Feed
        </button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {userName}&apos;s Blogs
          </h1>
          <p className="text-lg text-gray-600">
            {blogs.length} {blogs.length === 1 ? 'post' : 'posts'} published
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => router.push(`/blog/${blog._id}`)}
              className="group block h-full cursor-pointer"
            >
              <div className="h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-400 flex flex-col hover:-translate-y-2">
                {/* Blog Image */}
                <div className="relative w-full h-56 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden flex-shrink-0">
                  {blog?.blogPhoto &&
                  Array.isArray(blog.blogPhoto) &&
                  blog.blogPhoto.length > 0 &&
                  getImageUrl(blog.blogPhoto[0]) ? (
                    <Image
                      src={getImageUrl(blog.blogPhoto[0])!}
                      alt={blog.blogTitle}
                      fill
                      className="object-cover pointer-events-none group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-50 relative overflow-hidden">
                      {/* Decorative circles */}
                      <div className="absolute w-40 h-40 bg-blue-200/30 rounded-full -top-10 -right-10"></div>
                      <div className="absolute w-32 h-32 bg-indigo-200/20 rounded-full bottom-0 -left-5"></div>

                      <div className="text-center relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/40 backdrop-blur rounded-full mb-3">
                          <svg
                            className="w-8 h-8 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-indigo-700">
                          No image available
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Blog Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                    {blog.blogTitle}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2 flex-1 mb-4">
                    {blog.blogBody}
                  </p>

                  {/* Footer */}
                  <div className="border-t border-gray-100 pt-4">
                    {/* Reactions */}
                    <div className="flex items-center gap-6 mb-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <ThumbsUp size={16} className="text-blue-600" />
                        <span className="text-gray-700">
                          {blog.reactions?.agreed?.length || 0} Agree
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <ThumbsDown size={16} className="text-orange-600" />
                        <span className="text-gray-700">
                          {blog.reactions?.disagreed?.length || 0} Disagree
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-gray-500 font-medium">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="flex justify-center mt-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={observerTarget} className="mt-12 text-center">
          {currentPage >= totalPages && blogs.length > 0 && (
            <p className="text-gray-500 text-lg">No more blogs to load</p>
          )}
        </div>
      </div>
    </div>
  );
}
