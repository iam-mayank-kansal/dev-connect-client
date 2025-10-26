'use client';

import React, { FC } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react'; // Updated icons

interface CardFooterProps {
  likesCount: number;
  dislikesCount: number;
  userReaction: 'like' | 'dislike' | null;
  onReact: (reaction: 'like' | 'dislike') => void;
  isSubmitting: boolean;
}

const CardFooter: FC<CardFooterProps> = ({
  likesCount,
  dislikesCount,
  userReaction,
  onReact,
  isSubmitting,
}) => {
  const isLiked = userReaction === 'like';
  const isDisliked = userReaction === 'dislike';

  return (
    <div className="p-2">
      <div className="flex justify-around border-t border-gray-100 pt-1">
        <button
          onClick={() => onReact('like')}
          disabled={isSubmitting}
          className={`flex items-center space-x-2 w-full justify-center p-2 rounded-lg transition-colors
            ${
              isLiked
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-100'
            }
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} />
          {/* The count is now displayed directly next to the icon for a cleaner look. */}
          <span className="font-medium text-sm tabular-nums">
            {likesCount.toLocaleString()}
          </span>
        </button>
        <button
          onClick={() => onReact('dislike')}
          disabled={isSubmitting}
          className={`flex items-center space-x-2 w-full justify-center p-2 rounded-lg transition-colors
            ${
              isDisliked
                ? 'text-red-600 bg-red-50'
                : 'text-gray-600 hover:bg-gray-100'
            }
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <ThumbsDown size={18} fill={isDisliked ? 'currentColor' : 'none'} />
          {/* The count is now displayed directly next to the icon for a cleaner look. */}
          <span className="font-medium text-sm tabular-nums">
            {dislikesCount.toLocaleString()}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CardFooter;
