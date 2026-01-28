import { useEffect } from 'react';
import { useConnectionStore } from '@/store/useConnectionStore';

export const useConnection = (autoFetch = false) => {
  // Select state and actions from the store
  const {
    connectedUsers,
    PendingRequestSent,
    PendingrequestReceived,
    Blocked,
    Ignored,
    isLoading,
    error,

    // Actions
    fetchConnections,
    sendRequest,
    suspendRequest,
    acceptRequest,
    deleteConnection,
    blockUser,
    unblockUser,
    ignoreUser,
    unignoreUser,
  } = useConnectionStore();

  // Optional: Auto-fetch data when the hook is first used
  useEffect(() => {
    if (autoFetch) {
      fetchConnections();
    }
  }, [autoFetch, fetchConnections]);

  return {
    // =========================================================
    // DATA (Renamed for Cleaner UI Code)
    // =========================================================
    connections: connectedUsers,
    requests: {
      sent: PendingRequestSent,
      received: PendingrequestReceived,
      count: PendingrequestReceived.length, // Useful for badges
    },
    blockedUsers: Blocked,
    ignoredUsers: Ignored,

    // Status
    isLoading,
    error,

    // =========================================================
    // ACTIONS
    // =========================================================
    refresh: fetchConnections,

    // Connect / Disconnect
    sendConnectionRequest: sendRequest,
    cancelSentRequest: suspendRequest,
    unfriend: deleteConnection,

    // Respond
    acceptConnection: (userId: string) => acceptRequest(userId, 'accepted'),
    rejectConnection: (userId: string) => acceptRequest(userId, 'rejected'),

    // Block / Unblock
    blockUser,
    unblockUser,

    // Ignore / Unignore
    ignoreUser,
    unignoreUser,
  };
};
