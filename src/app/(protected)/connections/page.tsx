'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Components
import { ConnectionSidebar } from '../../../components/connections/ConnectionSidebar';
import { ConnectionsView } from '../../../components/connections/views/ConnectionsView';
import { PendingView } from '../../../components/connections/views/PendingView';
import { FindConnectionsView } from '../../../components/connections/views/FindConnectionsView';
import DevconnectLoader from '../../../components/loadingSpinner';

// Hooks & Context
import { useFindConnections } from '../../../hooks/useFindConnections'; // Hook 2: Suggestions
import { useAuthStore } from '@/store/useAuthStore';
import { useConnection } from '@/hooks/useConnections';

const ConnectionPage: React.FC = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState<
    'connections' | 'pending' | 'find'
  >('connections');
  const [pendingTab, setPendingTab] = useState<'received' | 'sent'>('received');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { authUser, isCheckingAuth } = useAuthStore();

  // ===========================================================================
  // 1. CALL THE HOOKS
  // ===========================================================================

  // Hook 1: Main Connection Data (Store)
  const {
    connections,
    requests,
    isLoading: isConnectionLoading,

    // Actions
    sendConnectionRequest,
    cancelSentRequest,
    acceptConnection,
    rejectConnection,
    unfriend,
    blockUser,
    unblockUser,
    ignoreUser,
    unignoreUser,
  } = useConnection(true);

  // Hook 2: Suggestions Data (Local State)
  const {
    users: suggestedUsers,
    loading: isLoadingSuggested,
    removeUserFromList, // Helper to remove card instantly after action
  } = useFindConnections();

  // ===========================================================================
  // 2. CREATE HANDLERS (Bridge logic)
  // ===========================================================================

  // Construct the data object your views expect
  const connectionData = {
    connected: connections,
    requestReceived: requests.received,
    requestSent: requests.sent,
  };

  // Bridge: Send Request + Remove from suggestion list
  const handleConnect = async (userId: string) => {
    await sendConnectionRequest(userId);
    removeUserFromList(userId);
  };

  // Bridge: Handle Accept/Reject logic
  const connectionResponse = (userId: string, action: 'accept' | 'reject') => {
    if (action === 'accept') acceptConnection(userId);
    else rejectConnection(userId);
  };

  // Bridge: Handle Block/Unblock logic
  const handleBlockAndUnblock = async (
    userId: string,
    action: 'block' | 'unblock'
  ) => {
    if (action === 'block') {
      // 1. Call the global action (Updates Backend + Global Store)
      await blockUser(userId);

      // 2. [FIX] Call the local action (Updates the 'Find Connections' UI instantly)
      // This line was missing!
      if (activeView === 'find') {
        removeUserFromList(userId);
      }
    } else {
      unblockUser(userId);
    }
  };
  // Bridge: Handle Ignore/Unignore logic
  const handleIgnoreAndUnignore = (
    userId: string,
    action: 'ignore' | 'unignore'
  ) => {
    if (action === 'ignore') {
      ignoreUser(userId);
      // If ignoring from "Find" view, remove the card
      if (activeView === 'find') removeUserFromList(userId);
    } else {
      unignoreUser(userId);
    }
  };

  // ===========================================================================
  // 3. RENDER LOGIC
  // ===========================================================================

  const handleViewChange = (view: 'connections' | 'pending' | 'find') => {
    setActiveView(view);
    if (view !== 'connections') setSearchTerm('');
  };

  useEffect(() => {
    if (!isCheckingAuth && !authUser) router.push('/login');
  }, [authUser, router, isCheckingAuth]);

  if (isCheckingAuth || !authUser) return <DevconnectLoader />;

  const renderContent = () => {
    if (isConnectionLoading && activeView !== 'find') {
      return <DevconnectLoader />;
    }

    switch (activeView) {
      case 'connections':
        return (
          <ConnectionsView
            connections={connectionData.connected}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            // Pass the mapped function
            deleteConnection={unfriend}
            handleBlockAndUnblock={handleBlockAndUnblock}
          />
        );
      case 'pending':
        return (
          <PendingView
            activeTab={pendingTab}
            onTabChange={setPendingTab}
            receivedRequests={connectionData.requestReceived}
            sentRequests={connectionData.requestSent}
            // Pass the mapped functions
            suspendSentRequest={cancelSentRequest}
            connectionResponse={connectionResponse}
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
