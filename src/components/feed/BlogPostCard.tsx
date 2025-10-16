'use client';

import React, { FC, useState, useCallback } from 'react';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import PostMediaGrid from './PostMediaGrid';
import MediaCarousel from './MediaCarousel';
import ImageModal from './ImageModal'; // Updated import
import { getMediaUrl } from '@/utils/helper/blog';
import { Blog } from '@/lib/types/blog';

interface BlogPostCardProps {
  blog: Blog;
}

const BlogPostCard: FC<BlogPostCardProps> = ({ blog }) => {
  // State to manage the modal visibility and which image is currently selected
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  // Function to open the modal from a specific image
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

  // Function to close the modal
  const closeImageModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Function to navigate within the modal
  const navigateImageModal = useCallback((newIndex: number) => {
    setModalState((prev) => ({ ...prev, currentIndex: newIndex }));
  }, []);

  const hasVideos = blog.blogViedo && blog.blogViedo.length > 0;

  return (
    <>
      <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <CardHeader user={blog.userId} createdAt={blog.createdAt} />
        <CardBody title={blog.blogTitle} body={blog.blogBody} />

        {/* --- Intelligent Media Rendering (for photos) --- */}
        <PostMediaGrid
          photos={blog.blogPhoto || []}
          onImageClick={openImageModal} // Pass the new open modal function
        />

        {/* Videos get their own carousel if they exist */}
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
          likesCount={blog.likesCount}
          commentsCount={blog.commentsCount}
        />
      </article>

      {/* Conditionally render the modal with navigation */}
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
