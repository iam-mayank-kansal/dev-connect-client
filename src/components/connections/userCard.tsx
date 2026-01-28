'use client';
import React, { useState } from 'react';
import { MoreVertical, User, UserPlus } from 'lucide-react';
import Image from 'next/image';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    title: string;
    profilePicture?: string;
  };
  onConnect: (userId: string) => void;
  onNotInterested: (userId: string) => void;
  onHandleBlock: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onConnect,
  onNotInterested,
  onHandleBlock,
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
    <div className="relative p-5 bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-gray-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          {user?.profilePicture && isValidImageUrl(user.profilePicture) ? (
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
            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{user.title}</p>
          </div>
        </div>

        <div className="relative z-10">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <button
                onClick={() => {
                  onHandleBlock(user.id);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Block
              </button>
              <button
                onClick={() => {
                  onNotInterested(user.id);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Not Interested
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onConnect(user.id)}
        className="mt-5 w-full flex items-center justify-center px-4 py-2.5 rounded-full bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-colors"
      >
        <UserPlus size={18} className="mr-2" />
        Connect
      </button>
    </div>
  );
};

export default UserCard;
