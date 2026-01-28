'use client';
import React, { useState } from 'react';
import { MoreVertical, User } from 'lucide-react';
import Image from 'next/image';

interface UserFeedItemProps {
  user: {
    id: string;
    name: string;
    title: string;
    profilePicture?: string;
  };
  actions: {
    label: string;
    onClick: () => void;
    primary?: boolean;
  }[];
  showMoreOptions?: boolean;
  deleteConnection?: (userId: string) => void;
  handleBlockAndUnblock?: (userId: string, action: 'block' | 'unblock') => void;
}

const UserFeedItem: React.FC<UserFeedItemProps> = ({
  user,
  actions,
  showMoreOptions = false,
  deleteConnection,
  handleBlockAndUnblock,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Validate if profilePicture is a valid URL for Next.js Image
  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    return (
      url.startsWith('/') ||
      url.startsWith('http://') ||
      url.startsWith('https://')
    );
  };

  return (
    <div className="relative flex items-center justify-between p-4 bg-white rounded-lg shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center space-x-4">
        {user.profilePicture && isValidImageUrl(user.profilePicture) ? (
          <Image
            src={user.profilePicture}
            alt="Profile"
            width={128}
            height={128}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
          />
        ) : (
          <div className="w-12 p-1 h-12 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
            <User size={64} className="text-gray-400" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.title}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              action.primary
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {action.label}
          </button>
        ))}
        {showMoreOptions && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <MoreVertical size={20} />
            </button>
            {showMenu && (
              <div className="absolute top-8 right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    handleBlockAndUnblock?.(user.id, 'block');
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Block
                </button>
                <button
                  onClick={() => {
                    deleteConnection?.(user.id);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFeedItem;
