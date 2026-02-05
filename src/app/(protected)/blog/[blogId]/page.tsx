'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { axiosClient } from '@/lib/api/client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Blog } from '@/lib/types/blog';
import { getMediaUrl } from '@/lib/utils/media';
import { useAuthStore } from '@/store/useAuthStore';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
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
        const response = await axiosClient.get(`/blog/fetch-blog/${blogId}`);
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
      const currentReactionState = userReaction;
      let apiReactionToSend;

      if (currentReactionState === reactionType) {
        apiReactionToSend = '';
      } else {
        apiReactionToSend = reactionType === 'like' ? 'agree' : 'disagree';
      }

      const response = await axiosClient.put(`/blog/react-blog`, {
        blogId: blog?._id,
        reaction: apiReactionToSend,
      });

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
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const author =
    blog.userId && typeof blog.userId === 'object' ? blog.userId : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Go Back
        </button>

        {/* Blog Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
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
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.blogTitle}
            </h1>

            {/* Author & Meta Info */}
            {author && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 border-b border-gray-200 mb-8">
                {author.profilePicture && (
                  <Link
                    href={`/profile/${author._id}`}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <div className="relative w-14 h-14">
                      <Image
                        src={author.profilePicture}
                        alt={author.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </Link>
                )}
                <div className="flex-1">
                  <Link
                    href={`/profile/${author._id}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-lg inline-block"
                  >
                    {author.name}
                  </Link>
                  <p className="text-sm text-gray-600">{author.designation}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-10 text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {blog.blogBody}
            </div>

            {/* Images Gallery */}
            {blog.blogPhoto && blog.blogPhoto.length > 1 && (
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Gallery
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blog.blogPhoto.slice(1).map((photo, index) => {
                    const imageUrl = getMediaUrl(photo, 'images');
                    return imageUrl ? (
                      <div
                        key={index}
                        className="relative w-full h-72 bg-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group cursor-pointer"
                      >
                        <Image
                          src={imageUrl}
                          alt={`Blog image ${index + 2}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
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
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Videos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blog.blogViedo.map((video, index) => {
                    const videoUrl = getMediaUrl(video, 'videos');
                    return videoUrl ? (
                      <div
                        key={index}
                        className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                      >
                        <video controls className="w-full rounded-xl bg-black">
                          <source src={videoUrl} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Engagement Stats */}
            <div className="flex flex-wrap gap-3 pt-8 border-t border-gray-200">
              <button
                onClick={() => handleReaction('like')}
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  userReaction === 'like'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsUp
                  size={18}
                  fill={userReaction === 'like' ? 'currentColor' : 'none'}
                />
                <span>Agree ({likes})</span>
              </button>
              <button
                onClick={() => handleReaction('dislike')}
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  userReaction === 'dislike'
                    ? 'bg-orange-100 text-orange-700 border border-orange-300'
                    : 'text-gray-600 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsDown
                  size={18}
                  fill={userReaction === 'dislike' ? 'currentColor' : 'none'}
                />
                <span>Disagree ({dislikes})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Blogs Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            More from {author?.name || 'this author'}
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
            <p className="text-gray-600 text-lg">
              Visit their profile to see more blogs
            </p>
            {author && (
              <Link
                href={`/blogs/${author._id}`}
                className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View All Blogs
                <ArrowLeft size={18} className="rotate-180" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
