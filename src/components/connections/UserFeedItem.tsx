// src/components/connections/UserFeedItem.tsx
"use client"
import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';

interface User {
  id: number;
  name: string;
  title: string;
  avatar: string;
}

interface Action {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

interface UserFeedItemProps {
  user: User;
  actions: Action[];
  showMoreOptions?: boolean; // New optional prop
}

const UserFeedItem: React.FC<UserFeedItemProps> = ({ user, actions, showMoreOptions = false }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative flex items-center justify-between p-4 bg-white rounded-lg shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full ring-2 ring-gray-200"
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
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-gray-500 hover:text-gray-800 transition-colors">
              <MoreVertical size={20} />
            </button>
            {showMenu && (
              <div className="absolute top-8 right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    console.log('User blocked');
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Block
                </button>
                <button
                  onClick={() => {
                    console.log('User removed');
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