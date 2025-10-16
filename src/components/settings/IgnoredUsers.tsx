'use client';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useConnections } from '@/hooks/useConnections';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';

export default function IgnoredUsers() {
  const { connectionData, handleIgnoreAndUnignore } = useConnections();
  const [unignoringIds, setUnignoringIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Get ignored users from connectionData
  const ignoredUsers = connectionData.ignored || [];

  const handleUnignoreUser = async (userId: string) => {
    try {
      setUnignoringIds((prev) => new Set(prev.add(userId)));

      await handleIgnoreAndUnignore(userId, 'unignore');

      toast.success('User unignored successfully');
    } catch (error) {
      console.error('Failed to unignore user:', error);
      toast.error('Failed to unignore user');
    } finally {
      setUnignoringIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Filter users based on search term
  const filteredUsers = ignoredUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  return (
    <div className="space-y-4">
      {/* Header with Count and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {ignoredUsers.length} ignored user
            {ignoredUsers.length !== 1 ? 's' : ''}
          </span>
          {ignoredUsers.length > 0 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
              {filteredUsers.length} shown
            </span>
          )}
        </div>

        {ignoredUsers.length > 0 && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search ignored users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        )}
      </div>

      {/* Users List */}
      {ignoredUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-3">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No ignored users</p>
          <p className="text-sm text-gray-400 mt-1">
            Users you ignore will appear here for management
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No ignored users match your search</p>
        </div>
      ) : (
        <>
          {/* Users Grid */}
          <div className="grid gap-3">
            {currentUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Image
                    src={getImageUrl(user.profilePicture, 'profilePicture')}
                    alt={user.name}
                    width={128}
                    height={128}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {user.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {user.designation}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnignoreUser(user._id)}
                  disabled={unignoringIds.has(user._id)}
                  className="ml-3 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  {unignoringIds.has(user._id) ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-1 h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Unignoring
                    </span>
                  ) : (
                    'Unignore'
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
