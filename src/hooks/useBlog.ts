'use client';
import { BlogAPI } from '@/lib/types/api/blog';
import { blogService } from '@/services/blog/blogService';
import { useState } from 'react';

export function useBlog() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const createBlog = async (data: BlogAPI.CreateBlogRequest) => {
    setLoading(true);
    try {
      const response = await blogService.createBlog(data);
      return response;
    } catch (error) {
      console.error('Error creating blog:', error);
      setError('Error creating blog');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    createBlog,
  };
}
