// src/components/connections/Connection.tsx
"use client"
import UserCard from '@/components/connections/userCard';
import UserFeedItem from '@/components/connections/UserFeedItem';
import React, { useState } from 'react';

// Define the User interface for type safety
interface User {
  id: number;
  name: string;
  title: string;
  avatar: string;
}

// Dummy data for a large-scale demonstration
const allUsers: User[] = [
  { id: 1, name: 'John Doe', title: 'Senior Developer', avatar: 'https://i.pravatar.cc/150?u=a' },
  { id: 2, name: 'Jane Smith', title: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?u=b' },
  { id: 3, name: 'Michael Brown', title: 'Product Manager', avatar: 'https://i.pravatar.cc/150?u=c' },
  { id: 4, name: 'Sarah Wilson', title: 'Data Scientist', avatar: 'https://i.pravatar.cc/150?u=d' },
  { id: 5, name: 'David Lee', title: 'Software Engineer', avatar: 'https://i.pravatar.cc/150?u=e' },
  { id: 6, name: 'Emily Clark', title: 'Marketing Specialist', avatar: 'https://i.pravatar.cc/150?u=f' },
  { id: 7, name: 'Chris Evans', title: 'DevOps Engineer', avatar: 'https://i.pravatar.cc/150?u=g' },
  { id: 8, name: 'Olivia Adams', title: 'HR Manager', avatar: 'https://i.pravatar.cc/150?u=h' },
  { id: 9, name: 'Daniel White', title: 'Financial Analyst', avatar: 'https://i.pravatar.cc/150?u=i' },
  { id: 10, name: 'Sophia Taylor', title: 'Cybersecurity Expert', avatar: 'https://i.pravatar.cc/150?u=j' },
  { id: 11, name: 'Matthew Harris', title: 'Mobile Developer', avatar: 'https://i.pravatar.cc/150?u=k' },
  { id: 12, name: 'Ava Rodriguez', title: 'UX Researcher', avatar: 'https://i.pravatar.cc/150?u=l' },
  { id: 13, name: 'James Martinez', title: 'Cloud Architect', avatar: 'https://i.pravatar.cc/150?u=m' },
  { id: 14, name: 'Isabella King', title: 'Graphic Designer', avatar: 'https://i.pravatar.cc/150?u=n' },
  { id: 15, name: 'William Scott', title: 'Project Coordinator', avatar: 'https://i.pravatar.cc/150?u=o' },
  { id: 16, name: 'Mia Green', title: 'Backend Developer', avatar: 'https://i.pravatar.cc/150?u=p' },
  { id: 17, name: 'Lucas Turner', title: 'QA Engineer', avatar: 'https://i.pravatar.cc/150?u=q' },
  { id: 18, name: 'Ella Hill', title: 'Business Analyst', avatar: 'https://i.pravatar.cc/150?u=r' },
  { id: 19, name: 'Noah Evans', title: 'Network Engineer', avatar: 'https://i.pravatar.cc/150?u=s' },
  { id: 20, name: 'Lily Carter', title: 'Content Strategist', avatar: 'https://i.pravatar.cc/150?u=t' },
];

const TabButton = ({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) => {
  const baseClasses = "flex items-center px-4 py-3 rounded-lg w-full text-left transition-colors duration-200";
  const activeClasses = "bg-blue-100 text-blue-800 font-semibold";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100";

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {children}
    </button>
  );
};

const Connection: React.FC = () => {
  const [activeView, setActiveView] = useState<'connections' | 'pending' | 'find'>('connections');
  const [pendingTab, setPendingTab] = useState<'received' | 'sent'>('received');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const connections = allUsers.slice(0, 10);
  const pendingReceived = allUsers.slice(10, 15);
  const pendingSent = allUsers.slice(15, 18);
  const findConnections = allUsers.slice(18, 20);

  const filteredConnections = connections.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (activeView) {
      case 'connections':
        return (
          <>
            <input
              type="text"
              placeholder="Search your connections..."
              className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredConnections.length > 0 ? (
              <div className="space-y-4">
                {filteredConnections.map(user => (
                  <UserFeedItem
                    key={user.id}
                    user={user}
                    actions={[{ label: 'Message', onClick: () => console.log('Message') }]}
                    showMoreOptions={true} // Now explicitly controlling the 3-dot menu
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No connections found.</p>
            )}
          </>
        );
      case 'pending':
        return (
          <>
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setPendingTab('received')}
                className={`py-2 px-4 text-lg font-semibold transition-colors ${pendingTab === 'received' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Requests Received ({pendingReceived.length})
              </button>
              <button
                onClick={() => setPendingTab('sent')}
                className={`py-2 px-4 text-lg font-semibold transition-colors ${pendingTab === 'sent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Requests Sent ({pendingSent.length})
              </button>
            </div>
            {pendingTab === 'received' && (
              <div className="space-y-4">
                {pendingReceived.map(user => (
                  <UserFeedItem
                    key={user.id}
                    user={user}
                    actions={[
                      { label: 'Accept', onClick: () => console.log('Accepted'), primary: true },
                      { label: 'Decline', onClick: () => console.log('Declined') },
                    ]}
                    showMoreOptions={false} // No 3-dot menu here
                  />
                ))}
              </div>
            )}
            {pendingTab === 'sent' && (
              <div className="space-y-4">
                {pendingSent.map(user => (
                  <UserFeedItem
                    key={user.id}
                    user={user}
                    actions={[
                      { label: 'Cancel', onClick: () => console.log('Cancelled request'), primary: false },
                    ]}
                    showMoreOptions={false} // No 3-dot menu here
                  />
                ))}
              </div>
            )}
          </>
        );
      case 'find':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {findConnections.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onConnect={() => console.log('Connected')}
                onNotInterested={() => console.log('Not interested')} // New prop
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <aside className="w-64 bg-white shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Network</h2>
        <nav className="space-y-2">
          <TabButton isActive={activeView === 'connections'} onClick={() => setActiveView('connections')}>
            My Connections
          </TabButton>
          <TabButton isActive={activeView === 'pending'} onClick={() => setActiveView('pending')}>
            Pending Requests
          </TabButton>
          <TabButton isActive={activeView === 'find'} onClick={() => setActiveView('find')}>
            Find Connections
          </TabButton>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">My Network</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default Connection;