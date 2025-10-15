'use client';

import React, { useState, useEffect, FC } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Loader2, ServerCrash, Image as ImageIcon, Video } from 'lucide-react';

// --- Type Definitions ---

// Represents the populated user information from the backend
interface PopulatedUser {
  name: string;
}

// Represents a single blog post object returned from the API
interface Blog {
  blogTitle: string;
  blogBody: string;
  blogPhoto: string[]; // Array of image filenames
  blogViedo: string[]; // Array of video filenames
  userId: PopulatedUser;
}

// Defines the structure of the API response for the list of blogs
interface BlogListApiResponse {
    // The backend wrapper includes a 'data' property which is an array of blogs
    data: Blog[];
    message?: string;
}


// --- API Service Function ---

/**
 * Fetches all blog posts from the API.
 * @returns An AxiosResponse containing an array of blog posts.
 */
export async function getAllBlogs(): Promise<AxiosResponse<BlogListApiResponse>> {
  // Updated API URL as requested
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/devconnect/blog/list-all-blogs`;
  
  return axios.get(apiUrl, {
    withCredentials: true,
  });
}

// --- Helper Function ---

/**
 * Constructs the full URL for a blog media file (photo or video).
 * IMPORTANT: This assumes your backend serves static files from a specific path.
 * Adjust the base path ('/uploads/blogs/...') as needed to match your server setup.
 * @param filename - The name of the media file.
 * @param type - The type of media, either 'images' or 'videos'.
 * @returns The full URL to the media asset.
 */
const getBlogMediaUrl = (filename: string, type: 'images' | 'videos'): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  // Example path: http://localhost:5000/uploads/blogs/images/filename.jpg
  return `${baseUrl}/uploads/blogs/${type}/${filename}`;
};


// --- Main Component ---

const Home: FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllBlogs();
        // The actual list of blogs is inside the 'data' property of the response
        setBlogs(response.data.data); 
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || 'Failed to fetch blogs.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-gray-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-xl">Loading posts...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-red-400">
          <ServerCrash className="w-12 h-12 mb-4" />
          <p className="text-xl">Error loading posts</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    
    if (!blogs || blogs.length === 0) {
       return (
        <div className="text-center text-gray-400">
            <h2 className="text-2xl font-bold mb-2">No Posts Yet</h2>
            <p>Be the first to share your story on Devconnect!</p>
        </div>
       );
    }

    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Correctly map over the 'blogs' state array */}
        {blogs.map((blog, index) => (
          <article key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="p-6">
              <p className="text-sm text-purple-400 font-semibold mb-2">
                Posted by {blog.userId?.name || 'Anonymous'}
              </p>
              <h2 className="text-3xl font-bold text-white mb-4">{blog.blogTitle}</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{blog.blogBody}</p>
            </div>
            
            {/* Render Images */}
            {blog.blogPhoto && blog.blogPhoto.length > 0 && (
                <div className="p-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {blog.blogPhoto.map((photo, photoIndex) => (
                        <div key={photoIndex} className="relative aspect-square bg-gray-700 rounded-md overflow-hidden">
                             <img
                                src={getBlogMediaUrl(photo, 'images')}
                                alt={`Blog content image ${photoIndex + 1}`}
                                className="w-full h-full object-cover"
                                // Add an error handler for broken image links
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/1F2G937/7C3AED?text=Image+Not+Found')}
                             />
                        </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Render Videos */}
            {blog.blogViedo && blog.blogViedo.length > 0 && (
                <div className="p-6 space-y-4">
                    {blog.blogViedo.map((video, videoIndex) => (
                        <div key={videoIndex}>
                            <video controls className="w-full rounded-lg bg-black">
                                <source src={getBlogMediaUrl(video, 'videos')} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))}
                </div>
            )}
          </article>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-8">
       <div className="w-full max-w-4xl text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 text-white">
            Devconnect Feed
            </h1>
            <p className="text-lg text-gray-400">
            Discover the latest stories, projects, and ideas from our developer community.
            </p>
       </div>
      {renderContent()}
    </div>
  );
};

export default Home;

