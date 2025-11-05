'use client';

import React, { FC, useEffect, useCallback, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const ImageModal: FC<ImageModalProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  // --- ALL HOOKS MUST BE AT THE TOP, BEFORE ANY RETURNS ---
  const [imageError, setImageError] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const goToNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (images.length > 1) {
        if (event.key === 'ArrowLeft') goToPrevious();
        if (event.key === 'ArrowRight') goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, onClose, images.length]);

  // **KEY FIX:** This hook is now at the top with the others.
  // It resets the error state whenever the user navigates to a new image.
  useEffect(() => {
    setImageError(false);
  }, [currentIndex, images]);

  // --- VALIDATION AND DATA (now safe to do after all hooks) ---
  const isInvalid =
    !images ||
    images.length === 0 ||
    typeof currentIndex !== 'number' ||
    !images[currentIndex];

  if (isInvalid) {
    return null;
  }

  const currentImageUrl = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  return (
    <div
      className="fixed inset-0 h-screen  bg-black flex items-center justify-center p-4 sm:p-6 md:p-8 z-[9999]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition cursor-pointer"
        onClick={onClose}
        aria-label="Close image viewer"
      >
        <X size={28} />
      </button>

      {hasMultipleImages && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div
        className="relative w-full h-full max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-white bg-gray-800 rounded">
            Image failed to load
          </div>
        ) : (
          <Image
            src={currentImageUrl}
            alt={`Image ${currentIndex + 1} of ${images.length}`}
            fill
            style={{ objectFit: 'contain' }}
            onError={() => {
              console.error('Image failed to load:', currentImageUrl);
              setImageError(true);
            }}
            unoptimized
          />
        )}
      </div>
    </div>
  );
};

export default ImageModal;
