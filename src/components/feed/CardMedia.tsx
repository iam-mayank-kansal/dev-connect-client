'use client';

import React, { FC } from 'react';
import MediaCarousel from './MediaCarousel';
import Image from 'next/image';
import { getMediaUrl } from '@/utils/helper/getMediaUrl-blog';

interface CardMediaProps {
  photos: string[];
  videos: string[];
  onImageClick: (imageUrl: string) => void;
}

const CardMedia: FC<CardMediaProps> = ({ photos, videos, onImageClick }) => {
  const hasMedia =
    (photos && photos.length > 0) || (videos && videos.length > 0);

  if (!hasMedia) return null;

  return (
    <div className="w-full aspect-video bg-gray-100 border-2">
      {' '}
      {/* <-- KEY FIX: Enforces a consistent aspect ratio */}
      <MediaCarousel>
        {photos?.map((photo) => (
          <div
            key={photo}
            className="flex-shrink-0 w-full h-full snap-center cursor-pointer"
            onClick={() => onImageClick(getMediaUrl(photo, 'images'))}
          >
            <Image
              src={getMediaUrl(photo, 'images')}
              alt="Blog content"
              className="w-full h-full object-cover"
            />{' '}
            {/* <-- KEY FIX: Fills the container */}
          </div>
        ))}
        {videos?.map((video) => (
          <div key={video} className="flex-shrink-0 w-full h-full snap-center">
            <video controls className="w-full h-full object-cover bg-black">
              <source src={getMediaUrl(video, 'videos')} type="video/mp4" />
            </video>
          </div>
        ))}
      </MediaCarousel>
    </div>
  );
};

export default CardMedia;
