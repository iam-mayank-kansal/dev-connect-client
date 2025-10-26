'use client';
import UserFeedItem from '../UserFeedItem';
import { ApiUser } from '@/lib/types/connection';

interface ConnectionsViewProps {
  connections: ApiUser[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  // Accept functions as props
  deleteConnection: (userId: string) => void;
  handleBlockAndUnblock: (userId: string, action: 'block' | 'unblock') => void;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  connections,
  searchTerm,
  onSearchChange,
  deleteConnection,
  handleBlockAndUnblock,
}) => {
  const filteredConnections = connections.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search your connections..."
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {filteredConnections.length > 0 ? (
        <div className="space-y-4">
          {filteredConnections.map((user) => (
            <UserFeedItem
              key={user._id}
              user={{
                id: user._id,
                name: user.name,
                title: user.designation,
                avatar: user.profilePicture,
              }}
              actions={[
                {
                  label: 'Message',
                  onClick: () => console.log(`Message ${user._id}`),
                },
              ]}
              showMoreOptions={true}
              // Pass the functions down to the item
              deleteConnection={deleteConnection}
              handleBlockAndUnblock={handleBlockAndUnblock}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No connections found.</p>
      )}
    </>
  );
};
