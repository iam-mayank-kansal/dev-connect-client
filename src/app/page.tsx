'use client';

import React, { useState, useEffect, FC } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Loader2, ServerCrash } from 'lucide-react';
import BlogPostCard from '@/components/feed/BlogPostCard';
import { Blog, BlogListApiResponse } from '@/lib/types/blog';
import { useUser } from '@/utils/context/user-context';
import Link from 'next/link';

// --- API FUNCTION ---
async function getAllBlogs(): Promise<AxiosResponse<BlogListApiResponse>> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/devconnect/blog/list-all-blogs`;
  return axios.get(apiUrl, { withCredentials: true });
}

// --- MAIN PAGE COMPONENT ---
const Home: FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllBlogs();

        // Sort the blogs by the 'createdAt' date in descending order (newest first)
        const sortedBlogs = response.data.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setBlogs(sortedBlogs);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || 'Failed to fetch blogs.');
        } else {
          setError('An unexpected network error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const renderContent = () => {
    if (loading)
      return (
        <div className="text-center text-gray-500 mt-16">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
          <p>Loading Feed...</p>
        </div>
      );
    if (error)
      return (
        <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg mt-16">
          <ServerCrash className="w-10 h-10 mx-auto mb-3" />
          <p className="font-semibold">Error Loading Posts</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    if (!blogs || blogs.length === 0)
      return (
        <div className="text-center text-gray-500 mt-16 border-2 border-dashed p-10 rounded-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            The Feed is Quiet
          </h2>
          <p>Be the first to share your story!</p>
        </div>
      );
    return (
      <div className="w-full max-w-xl mx-auto space-y-5">
        {blogs.map((blog, index) => (
          <BlogPostCard key={blog._id || index} blog={blog} />
        ))}
      </div>
    );
  };

  return (
    <>
      {!user ? (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-8 text-center">
          <div className="flex-grow flex flex-col items-center justify-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4">
              Devconnect
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl text-gray-400 mb-8">
              Your Gateway to the Global Developer Community. Build your
              professional profile, showcase your projects, and connect with
              fellow developers.
            </p>
            <Link
              href={'/signup'}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
            >
              Join Devconnect
            </Link>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col items-center p-4">
          <header className="w-full max-w-xl text-center my-8"></header>
          <main className="w-full">{renderContent()}</main>
        </div>
      )}
    </>
  );
};

export default Home;
