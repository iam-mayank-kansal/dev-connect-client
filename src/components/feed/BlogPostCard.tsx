'use client';

import React, { FC, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import PostMediaGrid from './PostMediaGrid';
import MediaCarousel from './MediaCarousel';
import ImageModal from './ImageModal';
import { Blog } from '@/lib/types/blog';
import { useAuthStore } from '@/store/useAuthStore';
import { getMediaUrl } from '@/utils/helper/getMediaUrl-blog';

interface BlogPostCardProps {
  blog: Blog;
}

const BlogPostCard: FC<BlogPostCardProps> = ({ blog }) => {
  const { authUser } = useAuthStore();

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

    // We capture the UI's state *before* the API call to correctly determine if it's an undo action.
    const currentReactionState = userReaction;
    let apiReactionToSend;

    // If the user clicks the same button again, they are taking back their reaction.
    if (currentReactionState === reactionType) {
      // We will send an empty string to signify this.
      // NOTE: This requires a change in the backend validation to accept an empty 'reaction' field.
      apiReactionToSend = '';
    } else {
      // Otherwise, it's a new reaction or a switch from like to dislike.
      apiReactionToSend = reactionType === 'like' ? 'agree' : 'disagree';
    }

    try {
      // The backend needs to handle the case where 'reaction' is an empty string.
      const response = await axios.put(
        apiUrl,
        {
          blogId: blog._id,
          reaction: apiReactionToSend,
        },
        { withCredentials: true }
      );

      // The backend is the single source of truth for the counts.
      const { agreedCount, disagreedCount } = response.data.data;
      setLikes(agreedCount);
      setDislikes(disagreedCount);

      // After a successful API call, we update the UI state.
      // If the user clicked the button that was already active, it's an "undo".
      if (currentReactionState === reactionType) {
        setUserReaction(null); // This clears the reaction, making the button "empty".
      } else {
        // Otherwise, it's a new reaction or a switch from like to dislike (or vice versa).
        setUserReaction(reactionType);
      }
    } catch (error) {
      console.error('Failed to submit reaction:', error);
      // Optional: Add logic here to revert the UI state on API failure.
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Image Modal Functions ---
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

  const hasVideos = blog.blogViedo && blog.blogViedo.length > 0;

  return (
    <>
      <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <CardHeader user={blog.userId} createdAt={blog.createdAt} />
        <CardBody title={blog.blogTitle} body={blog.blogBody} />

        <PostMediaGrid
          photos={blog.blogPhoto || []}
          onImageClick={openImageModal}
        />

        {hasVideos && (
          <div className="mt-1">
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

        <CardFooter
          likesCount={likes}
          dislikesCount={dislikes}
          userReaction={userReaction}
          onReact={handleReaction}
          isSubmitting={isSubmitting}
        />
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
