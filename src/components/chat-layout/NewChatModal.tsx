'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, MessageSquare, Loader2, User } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { useConnection } from '@/hooks/useConnections';
import { User as UserEntity } from '@/lib/types/entities';
import Image from 'next/image';

interface NewChatModalProps {
  onClose: () => void;
}

export default function NewChatModal({ onClose }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { setSelectedUser } = useChatStore();

  const { connections, isLoading } = useConnection(true);

  const filteredUsers = connections.filter((user: UserEntity) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (user: UserEntity) => {
    onClose();
    setSelectedUser(user);
    router.push(`/chat/${user?._id}`);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-gray-800">New Message</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-100">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              autoFocus
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 rounded-xl text-sm transition-all outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <MessageSquare size={40} className="mb-3 opacity-20" />
              <p>No connections found.</p>
            </div>
          ) : (
            filteredUsers.map((user: UserEntity) => (
              <button
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className="w-full flex items-center cursor-pointer gap-3 p-3 hover:bg-blue-50 rounded-xl transition-all group text-left"
              >
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
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-700">
                    {user?.name || ''}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {user?.designation || 'No designation provided'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
