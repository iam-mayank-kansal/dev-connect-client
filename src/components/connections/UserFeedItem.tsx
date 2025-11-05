'use client';
import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/helper/getImageUrl';

// Update props to accept functions
interface UserFeedItemProps {
  user: {
    id: string;
    name: string;
    title: string;
    avatar: string;
  };
  actions: {
    label: string;
    onClick: () => void;
    primary?: boolean;
  }[];
  showMoreOptions?: boolean;
  // Make functions optional so this component can be reused
  deleteConnection?: (userId: string) => void;
  handleBlockAndUnblock?: (userId: string, action: 'block' | 'unblock') => void;
}

const UserFeedItem: React.FC<UserFeedItemProps> = ({
  user,
  actions,
  showMoreOptions = false,
  // Receive functions from props
  deleteConnection,
  handleBlockAndUnblock,
}) => {
  // REMOVED: const { ... } = useConnections(); NO hook call here.
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative flex items-center justify-between p-4 bg-white rounded-lg shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center space-x-4">
        <Image
          src={getImageUrl(user.avatar, 'profilePicture')}
          alt={user.name}
          width={128}
          height={128}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
        />
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
                    // Use the prop function, and ensure it exists before calling
                    handleBlockAndUnblock?.(user.id, 'block');
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Block
                </button>
                <button
                  onClick={() => {
                    // Use the prop function
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
