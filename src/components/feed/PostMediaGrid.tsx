'use client';

import { getMediaUrl } from '@/lib/utils/media';
import Image from 'next/image';
import React, { FC } from 'react';

interface PostMediaGridProps {
  photos: (string | { url?: string; fileId?: string })[];
  onImageClick: (imageUrl: string) => void;
}

const PostMediaGrid: FC<PostMediaGridProps> = ({ photos, onImageClick }) => {
  const photoCount = photos.length;

  if (photoCount === 0) return null;

  // Reusable Image Component - this already has the onClick logic
  const GridImage = ({
    src,
    className = '',
    children,
  }: {
    src: string | { url?: string; fileId?: string };
    className?: string;
    children?: React.ReactNode;
  }) => (
    <div
      className={`relative cursor-pointer overflow-hidden bg-gray-100 ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onImageClick(getMediaUrl(src, 'images'));
      }}
    >
      <Image
        src={getMediaUrl(src, 'images')}
        alt="Post content"
        fill
        className="absolute inset-0 w-full h-screen object-cover transition-transform duration-300 hover:scale-105"
      />
      {children}
    </div>
  );

  // --- Layout Logic ---

  // Case 1: Single Image
  if (photoCount === 1) {
    return (
      // FIX: Ensure the GridImage component is used here.
      // The 'object-contain' is better for single images to show the whole picture without cropping.
      <div
        className="max-h-[550px] w-full overflow-hidden bg-gray-100 flex justify-center items-center cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onImageClick(getMediaUrl(photos[0], 'images'));
        }}
      >
        <Image
          src={getMediaUrl(photos[0], 'images')}
          alt="Post content"
          width={800}
          height={550}
          className="max-w-full max-h-[550px] h-auto object-contain"
        />
      </div>
    );
  }

  // Case 2: Two Images
  if (photoCount === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 aspect-video">
        <GridImage src={photos[0]} />
        <GridImage src={photos[1]} />
      </div>
    );
  }

  // Case 3: Three Images
  if (photoCount === 3) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1 aspect-video">
        <GridImage src={photos[0]} className="row-span-2" />
        <GridImage src={photos[1]} />
        <GridImage src={photos[2]} />
      </div>
    );
  }

  // Case 4: Four Images or more
  if (photoCount >= 4) {
    const remainingCount = photoCount - 4;
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1 aspect-video">
        <GridImage src={photos[0]} />
        <GridImage src={photos[1]} />
        <GridImage src={photos[2]} />
        <GridImage src={photos[3]}>
          {remainingCount > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                +{remainingCount}
              </span>
            </div>
          )}
        </GridImage>
      </div>
    );
  }

  return null;
};

export default PostMediaGrid;
