"use client";

import React, { useState, useEffect } from 'react';
import { ConnectionSidebar } from '@/components/connections/ConnectionSidebar';
import { ConnectionsView } from '@/components/connections/views/ConnectionsView';
import { PendingView } from '@/components/connections/views/PendingView';
import { FindConnectionsView } from '@/components/connections/views/FindConnectionsView';
import { LoadingState } from '@/components/connections/LoadingState';
import { useConnections } from '@/hooks/useConnections';

const ConnectionPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'connections' | 'pending' | 'find'>('connections');
  const [pendingTab, setPendingTab] = useState<'received' | 'sent'>('received');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const {
    connectionData,
    suggestedUsers,
    isLoading,
    isLoadingSuggested,
    fetchSuggestedConnections,
    handleConnect,
    handleIgnoreAndUnignore,
    handleBlockAndUnblock,
    suspendSentRequest,
    connectionResponse
  } = useConnections();

  // Fetch suggested connections only when "Find" tab becomes active and we haven't loaded them yet
  useEffect(() => {
    if (activeView === 'find' && suggestedUsers.length === 0 && !isLoadingSuggested) {
      fetchSuggestedConnections();
    }
  }, [activeView, suggestedUsers.length, isLoadingSuggested, fetchSuggestedConnections]);

  const handleViewChange = (view: 'connections' | 'pending' | 'find') => {
    setActiveView(view);
    // Clear search when switching views
    if (view !== 'connections') {
      setSearchTerm('');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    switch (activeView) {
      case 'connections':
        return (
          <ConnectionsView
            connections={connectionData.connected}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
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

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar - fixed and non-scrollable */}
      <div className="flex-shrink-0">
        <ConnectionSidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          connectionCounts={connectionCounts}
        />
      </div>

      {/* Main content - scrollable area */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">My Network</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default ConnectionPage;