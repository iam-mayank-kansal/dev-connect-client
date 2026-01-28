'use client';
import { User } from 'lucide-react';
import Image from 'next/image';

interface SidebarItemProps {
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
    role?: string;
  };
  onClick: () => void;
  isActive: boolean;
}

export default function SidebarItem({
  user,
  onClick,
  isActive,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 mb-1 rounded-xl cursor-pointer transition-colors group text-left
        ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}
      `}
    >
      <div className="relative shrink-0">
        {user?.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt="Profile"
            width={128}
            height={128}
            className="w-10 h-10 rounded-full object-cover border-4 border-white shadow-md"
          />
        ) : (
          <div className="w-10 p-1 h-10 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
            <User size={64} className="text-gray-400" />
          </div>
        )}
        {/* Online Status Indicator (Optional) */}
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold truncate text-sm">{user.name}</h3>
        </div>
        <p
          className={`text-xs truncate ${
            isActive ? 'text-blue-400' : 'text-gray-400'
          }`}
        >
          {user.role || 'Tap to chat'}
        </p>
      </div>
    </button>
  );
}
