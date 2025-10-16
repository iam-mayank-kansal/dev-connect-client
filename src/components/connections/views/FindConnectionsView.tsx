'use client';
import { ApiUser } from '@/lib/types/connection';
import UserCard from '../userCard';

interface FindConnectionsViewProps {
  suggestedUsers: ApiUser[];
  isLoading: boolean;
  onConnect: (userId: string) => void;
  onNotInterested: (userId: string, action: 'ignore' | 'unignore') => void;
  onHandleBlock: (userId: string, action: 'block' | 'unblock') => void;
}

export const FindConnectionsView: React.FC<FindConnectionsViewProps> = ({
  suggestedUsers,
  isLoading,
  onConnect,
  onNotInterested,
  onHandleBlock,
}) => {
  if (isLoading) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        Loading suggestions...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <h2 className="col-span-full text-xl font-bold text-gray-900 mb-4">
        Suggested Connections
      </h2>
      {suggestedUsers.length > 0 ? (
        suggestedUsers.map((user) => (
          <UserCard
            key={user._id}
            user={{
              id: user._id,
              name: user.name,
              title: user.designation,
              avatar: user.profilePicture,
            }}
            onConnect={() => onConnect(user._id)}
            onNotInterested={() => onNotInterested(user._id, 'ignore')}
            onHandleBlock={() => onHandleBlock(user._id, 'block')}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          No suggested connections found.
        </div>
      )}
    </div>
  );
};
