'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, Settings, LogOut, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

// Define the shape of User here or import it
interface User {
  _id: string;
  name?: string;
  email?: string;
  profilePicture?: string;
}

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const firstName = user.name?.split(' ')[0] || 'User';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full pl-1 pr-2 py-1 transition"
      >
        <div
          className={`${user?.profilePicture ? 'bg-white' : 'bg-blue-600 text-white'} p-0.5  rounded-full w-8 h-8 flex items-center justify-center font-medium overflow-hidden`}
        >
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
              width={32}
              height={32}
            />
          ) : (
            <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
          )}
        </div>

        <span className="text-gray-700 font-medium hidden lg:block">
          {user.name || 'User'}
        </span>
        <span className="text-gray-700 font-medium hidden sm:block lg:hidden">
          {firstName}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 border border-gray-200 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>

          <div className="p-2 space-y-1">
            {/* ➤ FIX: Use _id for profile link */}
            <Link
              href={`/profile/${user._id}`}
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md transition"
              onClick={() => setDropdownOpen(false)}
            >
              <UserIcon size={16} className="mr-2" />
              Profile
            </Link>

            <Link
              href="/settings"
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md transition"
              onClick={() => setDropdownOpen(false)}
            >
              <Settings size={16} className="mr-2" />
              Settings
            </Link>
          </div>

          <div className="p-2 border-t border-gray-100">
            <button
              className="flex w-full items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
              onClick={onLogout}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
