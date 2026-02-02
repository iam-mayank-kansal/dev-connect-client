'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { axiosInstanace } from '@/lib/axios';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, Heart, MessageCircle } from 'lucide-react';
import { Blog } from '@/lib/types/blog';
import { getMediaUrl } from '@/lib/utils/media';
import { useAuthStore } from '@/store/useAuthStore';

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = Array.isArray(params?.blogId)
    ? params.blogId[0]
    : params?.blogId;
  const { authUser } = useAuthStore();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      try {
        setLoading(true);
        const response = await axiosInstanace.get(`/blog/fetch-blog/${blogId}`);
        const blogData = response.data.data;
        setBlog(blogData);

        // Initialize reaction counts
        setLikes(blogData.reactions?.agreed?.length || 0);
        setDislikes(blogData.reactions?.disagreed?.length || 0);

        // Check user's reaction
        if (authUser?._id && blogData.reactions) {
          if (blogData.reactions.agreed.includes(authUser._id)) {
            setUserReaction('like');
          } else if (blogData.reactions.disagreed.includes(authUser._id)) {
            setUserReaction('dislike');
          }
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, authUser?._id]);

  const handleReaction = async (reactionType: 'like' | 'dislike') => {
    if (isSubmitting) return;
    if (!authUser) {
      alert('Please login to react');
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = `${
        process.env.NEXT_PUBLIC_API_BASE_URL || ''
      }/devconnect/blog/react-blog`;

      const currentReactionState = userReaction;
      let apiReactionToSend;

      if (currentReactionState === reactionType) {
        apiReactionToSend = '';
      } else {
        apiReactionToSend = reactionType === 'like' ? 'agree' : 'disagree';
      }

      const response = await axiosInstanace.put(
        apiUrl,
        {
          blogId: blog?._id,
          reaction: apiReactionToSend,
        },
        { withCredentials: true }
      );

      const { agreedCount, disagreedCount } = response.data.data;
      setLikes(agreedCount);
      setDislikes(disagreedCount);

      if (currentReactionState === reactionType) {
        setUserReaction(null);
      } else {
        setUserReaction(reactionType);
      }
    } catch (error) {
      console.error('Failed to submit reaction:', error);
      alert('Failed to update reaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Blog Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'The blog you are looking for does not exist.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  const author =
    blog.userId && typeof blog.userId === 'object' ? blog.userId : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Feed
        </Link>

        {/* Blog Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Image */}
          {blog.blogPhoto && blog.blogPhoto.length > 0 && (
            <div className="relative w-full h-96 bg-gray-200">
              {(() => {
                const imageUrl = getMediaUrl(blog.blogPhoto[0], 'images');
                return imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={blog.blogTitle}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : null;
              })()}
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blog.blogTitle}
            </h1>

            {/* Author & Meta Info */}
            {author && (
              <div className="flex items-center gap-4 py-4 border-b border-gray-200 mb-6">
                {author.profilePicture && (
                  <div className="relative w-12 h-12">
                    <Image
                      src={author.profilePicture}
                      alt={author.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Link
                    href={`/profile/${author._id}`}
                    className="font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {author.name}
                  </Link>
                  <p className="text-sm text-gray-600">{author.designation}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 whitespace-pre-wrap">
                {blog.blogBody}
              </p>
            </div>

            {/* Images Gallery */}
            {blog.blogPhoto && blog.blogPhoto.length > 1 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blog.blogPhoto.slice(1).map((photo, index) => {
                    const imageUrl = getMediaUrl(photo, 'images');
                    return imageUrl ? (
                      <div
                        key={index}
                        className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={imageUrl}
                          alt={`Blog image ${index + 2}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Videos */}
            {blog.blogViedo && blog.blogViedo.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Videos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blog.blogViedo.map((video, index) => {
                    const videoUrl = getMediaUrl(video, 'videos');
                    return videoUrl ? (
                      <video
                        key={index}
                        controls
                        className="w-full rounded-lg bg-black"
                      >
                        <source src={videoUrl} />
                        Your browser does not support the video tag.
                      </video>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Engagement Stats */}
            <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => handleReaction('like')}
                disabled={isSubmitting}
                className={`flex items-center gap-2 transition-colors ${
                  userReaction === 'like'
                    ? 'text-red-500'
                    : 'text-gray-600 hover:text-red-500'
                } disabled:opacity-50`}
              >
                <Heart
                  size={20}
                  fill={userReaction === 'like' ? 'currentColor' : 'none'}
                />
                <span className="text-sm font-medium">{likes} Agrees</span>
              </button>
              <button
                onClick={() => handleReaction('dislike')}
                disabled={isSubmitting}
                className={`flex items-center gap-2 transition-colors ${
                  userReaction === 'dislike'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                } disabled:opacity-50`}
              >
                <MessageCircle
                  size={20}
                  fill={userReaction === 'dislike' ? 'currentColor' : 'none'}
                />
                <span className="text-sm font-medium">
                  {dislikes} Disagrees
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Blogs Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            More from this author
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* This could be populated with related blogs */}
            <div className="text-center py-8 text-gray-500">
              <p>Check out more blogs on their profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
