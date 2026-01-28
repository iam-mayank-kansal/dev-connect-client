// services/userConnection/userConnectionService.ts
import { userConnectionAPI } from '@/lib/api/handlers/connections';
import { UserConnectionAPI } from '@/lib/types/api/connection';
import { User } from '@/lib/types/entities'; // Ensure this path matches your project

class UserConnectionService {
  // 1. Fetch all connections
  async getUserConnections(): Promise<
    UserConnectionAPI.GetUserConnectionsResponse['data']
  > {
    try {
      const data = await userConnectionAPI.getUserConnections();
      return data;
    } catch (error) {
      console.error('Failed to fetch user connections:', error);
      throw error;
    }
  }

  // 2. Send Request
  async sendRequest(toUserId: string): Promise<User> {
    try {
      const data = await userConnectionAPI.sendConnectionRequest({ toUserId });
      return data.toUserData;
    } catch (error) {
      console.error('Failed to send connection request:', error);
      throw error;
    }
  }

  // 3. Suspend (Cancel) Request
  async suspendRequest(toUserId: string): Promise<string> {
    try {
      const data = await userConnectionAPI.suspendConnectionRequest({
        toUserId,
      });
      return data.toUserId;
    } catch (error) {
      console.error('Failed to suspend connection request:', error);
      throw error;
    }
  }

  // 4. Accept/Reject Request
  async respondToRequest(
    fromUserId: string,
    status: 'accepted' | 'rejected'
  ): Promise<UserConnectionAPI.ConnectionResponseResponse['data']> {
    try {
      const data = await userConnectionAPI.connectionResponse({
        fromUserId,
        status,
      });
      return data;
    } catch (error) {
      console.error(`Failed to ${status} connection request:`, error);
      throw error;
    }
  }

  // 5. Delete Connection
  async deleteConnection(toUserId: string): Promise<string> {
    try {
      const data = await userConnectionAPI.deleteConnection({ toUserId });
      return data.toUserId;
    } catch (error) {
      console.error('Failed to delete connection:', error);
      throw error;
    }
  }

  // 6. Block User
  async blockUser(toUserId: string): Promise<User> {
    try {
      const data = await userConnectionAPI.blockUser({ toUserId });
      return data.blockedUser;
    } catch (error) {
      console.error('Failed to block user:', error);
      throw error;
    }
  }

  // 7. Unblock User
  async unblockUser(toUserId: string): Promise<string> {
    try {
      const data = await userConnectionAPI.unblockUser({ toUserId });
      return data.toUserId;
    } catch (error) {
      console.error('Failed to unblock user:', error);
      throw error;
    }
  }

  // 8. Ignore User
  async ignoreUser(toUserId: string): Promise<User> {
    try {
      const data = await userConnectionAPI.ignoreUser({ toUserId });
      return data.ignoredUser;
    } catch (error) {
      console.error('Failed to ignore user:', error);
      throw error;
    }
  }

  // 9. Unignore User
  async unignoreUser(toUserId: string): Promise<string> {
    try {
      const data = await userConnectionAPI.unignoreUser({ toUserId });
      return data.toUserId;
    } catch (error) {
      console.error('Failed to unignore user:', error);
      throw error;
    }
  }

  async findConnections(
    page = 1,
    limit = 10
  ): Promise<UserConnectionAPI.FindConnectionResponse['data']> {
    try {
      const data = await userConnectionAPI.findConnections({ page, limit });
      return data;
    } catch (error) {
      console.error('Failed to find connections:', error);
      throw error;
    }
  }
}

export const userConnectionService = new UserConnectionService();
