'use client';

import React, { FC } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';

interface CardFooterProps {
  likesCount: number;
  commentsCount: number;
}

const CardFooter: FC<CardFooterProps> = ({ likesCount, commentsCount }) => {
  return (
    <div className="p-2">
      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-1 px-2">
        {likesCount > 0 && <span>{likesCount.toLocaleString()} Likes</span>}
        {commentsCount > 0 && <span>{commentsCount.toLocaleString()} Comments</span>}
      </div>
      <div className="flex justify-around border-t border-gray-100 pt-1">
        <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 w-full justify-center p-2 rounded-lg transition-colors">
          <Heart size={18} /> <span className="font-medium text-sm">Like</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 w-full justify-center p-2 rounded-lg transition-colors">
          <MessageCircle size={18} /> <span className="font-medium text-sm">Comment</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 w-full justify-center p-2 rounded-lg transition-colors">
          <Send size={18} /> <span className="font-medium text-sm">Share</span>
        </button>
      </div>
    </div>
  );
};

export default CardFooter;