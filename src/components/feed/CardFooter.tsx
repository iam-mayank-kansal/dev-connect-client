'use client';

import React, { FC } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

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
    <div className="p-3">
      <div className="flex gap-2 border-t border-gray-100 pt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReact('like');
          }}
          disabled={isSubmitting}
          className={`flex items-center gap-2 flex-1 justify-center px-4 py-2 rounded-lg font-medium transition-all cursor-pointer
            ${
              isLiked
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <ThumbsUp size={16} fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-sm">Agree ({likesCount})</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReact('dislike');
          }}
          disabled={isSubmitting}
          className={`flex items-center gap-2 flex-1 justify-center px-4 py-2 rounded-lg font-medium transition-all cursor-pointer
            ${
              isDisliked
                ? 'bg-orange-100 text-orange-700 border border-orange-300'
                : 'text-gray-600 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'
            }
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <ThumbsDown size={16} fill={isDisliked ? 'currentColor' : 'none'} />
          <span className="text-sm">Disagree ({dislikesCount})</span>
        </button>
      </div>
    </div>
  );
};

export default CardFooter;
