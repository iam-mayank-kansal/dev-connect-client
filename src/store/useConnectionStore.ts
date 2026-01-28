import { userConnectionService } from '@/services/connections/connectionService';
import { create } from 'zustand';
import { User } from '@/lib/types/entities';

interface ConnectionStore {
  connectedUsers: User[];
  PendingRequestSent: User[];
  PendingrequestReceived: User[];
  Blocked: User[];
  Ignored: User[];
  isLoading: boolean;
  error: string | null;
  fetchConnections: () => Promise<void>;
  sendRequest: (toUserId: string) => Promise<void>;
  suspendRequest: (toUserId: string) => Promise<void>;
  acceptRequest: (
    fromUserId: string,
    status: 'accepted' | 'rejected'
  ) => Promise<void>;
  deleteConnection: (userId: string) => Promise<void>;
  blockUser: (toUserId: string) => Promise<void>;
  unblockUser: (toUserId: string) => Promise<void>;
  ignoreUser: (toUserId: string) => Promise<void>;
  unignoreUser: (toUserId: string) => Promise<void>;
}

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  // STATE
  connectedUsers: [],
  PendingRequestSent: [],
  PendingrequestReceived: [],
  Blocked: [],
  Ignored: [],
  isLoading: false,
  error: null,

  // ACTIONS

  async fetchConnections() {
    set({ isLoading: true, error: null });
    try {
      const data = await userConnectionService.getUserConnections();
      set({
        connectedUsers: data.connected || [],
        PendingRequestSent: data.requestSent || [],
        PendingrequestReceived: data.requestReceived || [],
        Blocked: data.blocked || [],
        Ignored: data.ignored || [],
      });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch connections',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  async sendRequest(toUserId: string) {
    set({ isLoading: true, error: null });
    try {
      // Service returns the full User object of the person we sent the request to
      const toUserData = await userConnectionService.sendRequest(toUserId);

      set({
        PendingRequestSent: [...get().PendingRequestSent, toUserData],
      });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to Send connection Request',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  async suspendRequest(toUserId: string) {
    set({ isLoading: true, error: null });
    try {
      // Service returns the ID of the user request was suspended for
      const suspendedUserId =
        await userConnectionService.suspendRequest(toUserId);

      set({
        PendingRequestSent: get().PendingRequestSent.filter(
          (user: User) => user._id !== suspendedUserId
        ),
      });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to Suspend connection Request',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  async acceptRequest(fromUserId: string, status: 'accepted' | 'rejected') {
    set({ isLoading: true, error: null });
    try {
      const responseData = await userConnectionService.respondToRequest(
        fromUserId,
        status
      );

      // 1. Always remove from Pending Received
      set({
        PendingrequestReceived: get().PendingrequestReceived.filter(
          (user: User) => user._id !== fromUserId
        ),
      });

      if (responseData.status === 'accepted') {
        get().fetchConnections();
      }
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error
            ? error.message
            : `Failed to ${status.slice(0, -2)} connection Request`,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  async deleteConnection(userId: string) {
    set({ isLoading: true, error: null });
    try {
      const deletedUserId =
        await userConnectionService.deleteConnection(userId);

      set({
        connectedUsers: get().connectedUsers.filter(
          (user: User) => user._id !== deletedUserId
        ),
      });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to Delete Connection',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // ===========================================================================
  // BLOCK/UNBLOCK
  // ===========================================================================

  async blockUser(toUserId: string) {
    set({ isLoading: true, error: null });
    try {
      // Service returns the full User object of the blocked user
      const blockedUser = await userConnectionService.blockUser(toUserId);

      // Add to Blocked list
      set({
        Blocked: [...get().Blocked, blockedUser],
        // Remove from connected
        connectedUsers: get().connectedUsers.filter(
          (u: User) => u._id !== toUserId
        ),
        // Remove from pending received
        PendingrequestReceived: get().PendingrequestReceived.filter(
          (u: User) => u._id !== toUserId
        ),
        // Remove from pending sent
        PendingRequestSent: get().PendingRequestSent.filter(
          (u: User) => u._id !== toUserId
        ),
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to Block User',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  async unblockUser(toUserId: string) {
    set({ isLoading: true, error: null });
    try {
      // Service returns the ID
      const unblockedUserId = await userConnectionService.unblockUser(toUserId);

      set({
        Blocked: get().Blocked.filter(
          (user: User) => user._id !== unblockedUserId
        ),
      });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to Unblock User',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // ===========================================================================
  // IGNORE/UNIGNORE
  // ===========================================================================

  async ignoreUser(toUserId: string) {
    set({ isLoading: true, error: null });
    try {
      // Service returns the full User object
      const ignoredUser = await userConnectionService.ignoreUser(toUserId);

      set({
        Ignored: [...get().Ignored, ignoredUser],
        // Remove from pending received list
        PendingrequestReceived: get().PendingrequestReceived.filter(
          (user: User) => user._id !== toUserId
        ),
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to Ignore User',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  async unignoreUser(toUserId: string) {
    set({ isLoading: true, error: null });
    try {
      // Service returns the ID
      const unignoredUserId =
        await userConnectionService.unignoreUser(toUserId);

      set({
        Ignored: get().Ignored.filter(
          (user: User) => user._id !== unignoredUserId
        ),
      });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to Unignore User',
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
