'use client';

import React from 'react';
import UserFeedItem from '../UserFeedItem';
import { ApiUser } from '@/lib/types/connection';

interface PendingViewProps {
  activeTab: 'received' | 'sent';
  onTabChange: (tab: 'received' | 'sent') => void;
  receivedRequests: ApiUser[];
  sentRequests: ApiUser[];
  suspendSentRequest: (userId: string) => void;
  connectionResponse: (userId: string, action: 'accept' | 'reject') => void;
}

export const PendingView: React.FC<PendingViewProps> = ({
  activeTab,
  onTabChange,
  receivedRequests,
  sentRequests,
  suspendSentRequest,
  connectionResponse,
}) => {
  return (
    <>
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => onTabChange('received')}
          className={`py-2 px-4 text-lg font-semibold transition-colors ${
            activeTab === 'received'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Requests Received ({receivedRequests.length})
        </button>
        <button
          onClick={() => onTabChange('sent')}
          className={`py-2 px-4 text-lg font-semibold transition-colors ${
            activeTab === 'sent'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Requests Sent ({sentRequests.length})
        </button>
      </div>

      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedRequests.length > 0 ? (
            receivedRequests.map((user) => (
              <UserFeedItem
                key={user._id}
                user={{
                  id: user._id,
                  name: user.name,
                  title: user.designation,
                  profilePicture: user.profilePicture,
                }}
                actions={[
                  {
                    label: 'Accept',
                    onClick: () => connectionResponse(user._id, 'accept'),
                    primary: true,
                  },
                  {
                    label: 'Decline',
                    onClick: () => connectionResponse(user._id, 'reject'),
                  },
                ]}
                showMoreOptions={false}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">
              No pending requests received.
            </p>
          )}
        </div>
      )}

      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length > 0 ? (
            sentRequests.map((user) => (
              <UserFeedItem
                key={user._id}
                user={{
                  id: user._id,
                  name: user.name,
                  title: user.designation,
                  profilePicture: user.profilePicture,
                }}
                actions={[
                  {
                    label: 'Cancel',
                    onClick: () => suspendSentRequest(user._id),
                  },
                ]}
                showMoreOptions={false}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">
              No pending requests sent.
            </p>
          )}
        </div>
      )}
    </>
  );
};
