'use client';

import { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react'; // 1. Imported Plus
import SidebarItem from './SidebarItem';
import { useChatStore } from '@/store/useChatStore';
import ChatSidebarSkeleton from '../skeletons/ChatSidebarSkeleton';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  profilePicture?: string;
  role?: string;
}

// 2. Added prop definition
interface ChatSidebarProps {
  onOpenModal: () => void;
}

export default function ChatSidebar({ onOpenModal }: ChatSidebarProps) {
  const { users, selectedUser, getUsers, setSelectedUser, isUsersLoading } =
    useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleSelectChat = (user: User) => {
    setSelectedUser(user);
    router.push(`/chat/${user._id}`);
  };

  const userList = Array.isArray(users) ? users : [];

  const filteredUsers = userList.filter((user: User) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarClasses = `
    w-full md:w-80 lg:w-96 flex-col border-r border-gray-200 bg-white transition-all duration-300 z-10 h-full
    ${selectedUser ? 'hidden md:flex' : 'flex'}
  `;

  if (isUsersLoading) {
    return (
      <aside className={sidebarClasses}>
        <ChatSidebarSkeleton />
      </aside>
    );
  }

  return (
    <aside className={sidebarClasses}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>

          {/* 3. The Plus Button is back */}
          <button
            onClick={onOpenModal}
            className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 hover:scale-105 transition-all shadow-sm"
            title="New Chat"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 rounded-xl text-sm transition-all outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {filteredUsers.length === 0 ? (
          <div className="text-center p-8 text-gray-400">
            <p className="text-sm">
              {searchQuery ? 'No matching contacts.' : 'No connections yet.'}
            </p>
          </div>
        ) : (
          filteredUsers.map((user: User) => (
            <SidebarItem
              key={user._id}
              user={user}
              onClick={() => handleSelectChat(user)}
              isActive={selectedUser?._id === user._id}
            />
          ))
        )}
      </div>
    </aside>
  );
}
