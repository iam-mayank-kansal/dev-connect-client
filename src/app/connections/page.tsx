'use client';

import React, { useState, useEffect } from 'react';
// Attempting to fix path resolution errors by using relative paths
import { ConnectionSidebar } from '../../components/connections/ConnectionSidebar';
import { ConnectionsView } from '../../components/connections/views/ConnectionsView';
import { PendingView } from '../../components/connections/views/PendingView';
import { FindConnectionsView } from '../../components/connections/views/FindConnectionsView';
import { useConnections } from '../../hooks/useConnections';
import { useUser } from '../../utils/context/user-context';
import { useRouter } from 'next/navigation';
import DevconnectLoader from '../../components/loadingSpinner';

const ConnectionPage: React.FC = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState<
    'connections' | 'pending' | 'find'
  >('connections');
  const [pendingTab, setPendingTab] = useState<'received' | 'sent'>('received');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // The hook is now called ONLY ONCE here. This is our single source of truth.
  const {
    connectionData,
    suggestedUsers,
    isLoading,
    isLoadingSuggested,
    handleConnect,
    handleIgnoreAndUnignore,
    handleBlockAndUnblock,
    suspendSentRequest,
    connectionResponse,
    deleteConnection, // Get the delete function from the hook
  } = useConnections();

  const { user, isLoading: userIsLoading } = useUser();

  const handleViewChange = (view: 'connections' | 'pending' | 'find') => {
    setActiveView(view);
    if (view !== 'connections') {
      setSearchTerm('');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      // Use the main loader while the initial data is loading
      return <DevconnectLoader />;
    }

    switch (activeView) {
      case 'connections':
        return (
          <ConnectionsView
            connections={connectionData.connected}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            // Pass the functions down as props
            deleteConnection={deleteConnection}
            handleBlockAndUnblock={handleBlockAndUnblock}
          />
        );
      case 'pending':
        return (
          <PendingView
            activeTab={pendingTab}
            onTabChange={setPendingTab}
            receivedRequests={connectionData.requestReceived}
            suspendSentRequest={suspendSentRequest}
            connectionResponse={connectionResponse}
            sentRequests={connectionData.requestSent}
          />
        );
      case 'find':
        return (
          <FindConnectionsView
            suggestedUsers={suggestedUsers}
            isLoading={isLoadingSuggested}
            onConnect={handleConnect}
            onNotInterested={handleIgnoreAndUnignore}
            onHandleBlock={handleBlockAndUnblock}
          />
        );
      default:
        return null;
    }
  };

  const connectionCounts = {
    connected: connectionData.connected.length,
    received: connectionData.requestReceived.length,
    sent: connectionData.requestSent.length,
  };

  useEffect(() => {
    if (!userIsLoading && !user) {
      router.push('/login');
    }
    // Fixed the missing dependency warning by adding 'userIsLoading'
  }, [user, router, userIsLoading]);

  // A simpler check for the initial loading state.
  if (!user) {
    return <DevconnectLoader />;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-shrink-0">
        <ConnectionSidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          connectionCounts={connectionCounts}
        />
      </div>
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          My Network
        </h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default ConnectionPage;
