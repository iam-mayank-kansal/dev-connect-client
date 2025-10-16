'use client';

import React, { FC, useRef, useState, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaCarouselProps {
  children: ReactNode;
}

const MediaCarousel: FC<MediaCarouselProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showNav, setShowNav] = useState({ left: false, right: false });

  const checkNavigation = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const isScrollable = scrollWidth > clientWidth;
      setShowNav({
        left: isScrollable && scrollLeft > 1,
        right: isScrollable && scrollLeft < scrollWidth - clientWidth - 1,
      });
    }
  };

  useEffect(() => {
    checkNavigation();
    // Add event listener for window resize
    window.addEventListener('resize', checkNavigation);
    return () => window.removeEventListener('resize', checkNavigation);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative bg-gray-100">
      <div
        ref={scrollRef}
        onScroll={checkNavigation}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
      >
        {children}
      </div>
      {showNav.left && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition z-10"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {showNav.right && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition z-10"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
};

export default MediaCarousel;
