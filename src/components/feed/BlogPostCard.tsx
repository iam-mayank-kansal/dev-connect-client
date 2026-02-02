'use client';

import React, { FC, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import PostMediaGrid from './PostMediaGrid';
import MediaCarousel from './MediaCarousel';
import ImageModal from './ImageModal';
import { Blog } from '@/lib/types/blog';
import { useAuthStore } from '@/store/useAuthStore';
import { getMediaUrl } from '@/lib/utils/media';

interface BlogPostCardProps {
  blog: Blog;
}

const BlogPostCard: FC<BlogPostCardProps> = ({ blog }) => {
  const { authUser } = useAuthStore();
  const router = useRouter();

  // --- Image Modal State ---
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  // --- Reaction State ---
  const [likes, setLikes] = useState(blog.reactions?.agreed?.length || 0);
  const [dislikes, setDislikes] = useState(
    blog.reactions?.disagreed?.length || 0
  );

  const getInitialUserReaction = useCallback(() => {
    if (!authUser?._id || !blog.reactions) return null;
    if (blog.reactions.agreed.includes(authUser._id)) return 'like';
    if (blog.reactions.disagreed.includes(authUser._id)) return 'dislike';
    return null;
  }, [authUser?._id, blog.reactions]);

  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(
    getInitialUserReaction
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if the user logs in/out or the blog data changes
  useEffect(() => {
    setUserReaction(getInitialUserReaction());
  }, [getInitialUserReaction]);

  // --- Reaction API Call Handler ---
  const handleReaction = async (reactionType: 'like' | 'dislike') => {
    if (isSubmitting) return;
    setIsSubmitting(true);

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

    try {
      const response = await axios.put(
        apiUrl,
        {
          blogId: blog._id,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const openImageModal = useCallback(
    (startingImageUrl: string) => {
      const allPhotos = blog.blogPhoto || [];
      const initialIndex = allPhotos.findIndex(
        (photo) => getMediaUrl(photo, 'images') === startingImageUrl
      );
      if (initialIndex !== -1) {
        setModalState({
          isOpen: true,
          images: allPhotos.map((photo) => getMediaUrl(photo, 'images')),
          currentIndex: initialIndex,
        });
      }
    },
    [blog.blogPhoto]
  );

  const closeImageModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const navigateImageModal = useCallback((newIndex: number) => {
    setModalState((prev) => ({ ...prev, currentIndex: newIndex }));
  }, []);

  const handleBlogClick = useCallback(() => {
    router.push(`/blog/${blog._id}`);
  }, [router, blog._id]);

  const hasVideos = blog.blogViedo && blog.blogViedo.length > 0;

  return (
    <>
      <article
        className="bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-border/80 cursor-pointer"
        onClick={handleBlogClick}
      >
        <CardHeader user={blog.userId} createdAt={blog.createdAt} />
        <div className="cursor-pointer hover:opacity-90 transition-opacity">
          <CardBody title={blog.blogTitle} body={blog.blogBody} />
        </div>

        {blog.blogPhoto && blog.blogPhoto.length > 0 && (
          <div className="border-t border-border/40">
            <PostMediaGrid
              photos={blog.blogPhoto || []}
              onImageClick={openImageModal}
            />
          </div>
        )}

        {hasVideos && (
          <div className="mt-0 border-t border-border/40">
            <MediaCarousel>
              {blog.blogViedo.map((video) => (
                <div
                  key={video}
                  className="flex-shrink-0 w-full h-full snap-center aspect-video"
                >
                  <video
                    controls
                    className="w-full h-full object-cover bg-black"
                  >
                    <source
                      src={getMediaUrl(video, 'videos')}
                      type="video/mp4"
                    />
                  </video>
                </div>
              ))}
            </MediaCarousel>
          </div>
        )}

        <div className="border-t border-border/40">
          <CardFooter
            likesCount={likes}
            dislikesCount={dislikes}
            userReaction={userReaction}
            onReact={handleReaction}
            isSubmitting={isSubmitting}
          />
        </div>
      </article>

      {modalState.isOpen && (
        <ImageModal
          images={modalState.images}
          currentIndex={modalState.currentIndex}
          onClose={closeImageModal}
          onNavigate={navigateImageModal}
        />
      )}
    </>
  );
};

export default BlogPostCard;
