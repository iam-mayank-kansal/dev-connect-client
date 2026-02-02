'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Blog } from '@/lib/types/blog';
import { blogService } from '@/services/blog/blogService';
import { sortBlogsByDate } from '@/lib/utils/blog';
import { getErrorMessage } from '@/lib/utils/errorHandler';

interface UseBlogFeedReturn {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  showCreateBlog: boolean;
  setShowCreateBlog: (show: boolean) => void;
  hasNewBlogs: boolean;
  newBlogCount: number;
  isRefetching: boolean;
  refetchBlogs: () => Promise<void>;
  currentPage: number;
  totalPages: number;
  isLoadingMore: boolean;
  loadMoreBlogs: () => Promise<void>;
  observerTarget: React.RefObject<HTMLDivElement | null>;
}

export function useBlogFeed(authUserId: string | undefined): UseBlogFeedReturn {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [hasNewBlogs, setHasNewBlogs] = useState(false);
  const [newBlogCount, setNewBlogCount] = useState(0);
  const [isRefetching, setIsRefetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial fetch blogs
  useEffect(() => {
    if (!authUserId) return;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await blogService.getAllBlogs(1, 10);
        const sortedBlogs = sortBlogsByDate(response.blogs);

        setBlogs(sortedBlogs);
        setCurrentPage(1);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [authUserId]);

  // Refetch blogs
  const refetchBlogs = async () => {
    try {
      setError(null);
      setIsRefetching(true);
      const response = await blogService.getAllBlogs(1, 10);
      const sortedBlogs = sortBlogsByDate(response.blogs);

      setBlogs(sortedBlogs);
      setCurrentPage(1);
      setTotalPages(response.pagination.totalPages);
      setHasNewBlogs(false);
      setNewBlogCount(0);
    } catch (err) {
      console.error('Error refetching blogs:', err);
    } finally {
      setIsRefetching(false);
    }
  };

  // Load more blogs
  const loadMoreBlogs = useCallback(async () => {
    if (isLoadingMore || currentPage >= totalPages) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await blogService.getAllBlogs(nextPage, 10);
      const newBlogs = sortBlogsByDate(response.blogs);

      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more blogs:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, currentPage, totalPages]);

  // Polling for new blogs
  useEffect(() => {
    if (!authUserId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await blogService.getAllBlogs(1, 10);
        const latestBlogs = sortBlogsByDate(response.blogs);

        if (latestBlogs.length > blogs.length) {
          setNewBlogCount(latestBlogs.length - blogs.length);
          setHasNewBlogs(true);
        } else if (
          latestBlogs.length > 0 &&
          blogs.length > 0 &&
          latestBlogs[0]._id !== blogs[0]._id
        ) {
          setHasNewBlogs(true);
          setNewBlogCount(1);
        }
      } catch (err) {
        console.error('Error polling for new blogs:', err);
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [blogs, authUserId]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
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

    const targetElement = observerTarget.current;
    if (targetElement) {
      observer.observe(targetElement);
    }

    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [isLoadingMore, currentPage, totalPages, loadMoreBlogs]);

  return {
    blogs,
    loading,
    error,
    showCreateBlog,
    setShowCreateBlog,
    hasNewBlogs,
    newBlogCount,
    isRefetching,
    refetchBlogs,
    currentPage,
    totalPages,
    isLoadingMore,
    loadMoreBlogs,
    observerTarget,
  };
}
