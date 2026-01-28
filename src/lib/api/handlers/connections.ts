import { UserConnectionAPI } from '@/lib/types/api/connection';
import { axiosClient } from '../client';

class UserConnectionAPI_Handler {
  // 1. Send Connection Request
  async sendConnectionRequest(
    data: UserConnectionAPI.SendConnectionRequest
  ): Promise<UserConnectionAPI.SendConnectionResponse['data']> {
    const response =
      await axiosClient.post<UserConnectionAPI.SendConnectionResponse>(
        '/userconnection/send-connection-request',
        data
      );
    return response.data.data;
  }

  // 2. Suspend (Cancel) Sent Request
  async suspendConnectionRequest(
    data: UserConnectionAPI.SuspendConnectionRequest
  ): Promise<UserConnectionAPI.SuspendConnectionResponse['data']> {
    const response =
      await axiosClient.delete<UserConnectionAPI.SuspendConnectionResponse>(
        '/userconnection/suspend-connection-request',
        { data: data }
      );
    return response.data.data;
  }

  // 3. Respond to Request (Accept/Reject)
  async connectionResponse(
    data: UserConnectionAPI.ConnectionResponseRequest
  ): Promise<UserConnectionAPI.ConnectionResponseResponse['data']> {
    const response =
      await axiosClient.post<UserConnectionAPI.ConnectionResponseResponse>(
        '/userconnection/connection-response',
        data
      );
    return response.data.data;
  }

  // 4. Delete Connection (Unfriend)
  async deleteConnection(
    data: UserConnectionAPI.DeleteConnectionRequest
  ): Promise<UserConnectionAPI.DeleteConnectionResponse['data']> {
    const response =
      await axiosClient.delete<UserConnectionAPI.DeleteConnectionResponse>(
        '/userconnection/delete-connection',
        { data: data }
      );
    return response.data.data;
  }

  // 5. Block User
  async blockUser(
    data: UserConnectionAPI.BlockUserRequest
  ): Promise<UserConnectionAPI.BlockUserResponse['data']> {
    const response =
      await axiosClient.post<UserConnectionAPI.BlockUserResponse>(
        '/userconnection/block-user',
        data
      );
    return response.data.data;
  }

  // 6. Unblock User
  async unblockUser(
    data: UserConnectionAPI.UnblockUserRequest
  ): Promise<UserConnectionAPI.UnblockUserResponse['data']> {
    const response =
      await axiosClient.post<UserConnectionAPI.UnblockUserResponse>(
        '/userconnection/unblock-user',
        data
      );
    return response.data.data;
  }

  // 7. Ignore User
  async ignoreUser(
    data: UserConnectionAPI.IgnoreUserRequest
  ): Promise<UserConnectionAPI.IgnoreUserResponse['data']> {
    const response =
      await axiosClient.post<UserConnectionAPI.IgnoreUserResponse>(
        '/userconnection/ignore-user',
        data
      );
    return response.data.data;
  }

  // 8. Unignore User
  async unignoreUser(
    data: UserConnectionAPI.UnignoreUserRequest
  ): Promise<UserConnectionAPI.UnignoreUserResponse['data']> {
    const response =
      await axiosClient.post<UserConnectionAPI.UnignoreUserResponse>(
        '/userconnection/unignore-user',
        data
      );
    return response.data.data;
  }

  // 9. Get All User Connections (For Network Page)
  async getUserConnections(): Promise<
    UserConnectionAPI.GetUserConnectionsResponse['data']
  > {
    const response =
      await axiosClient.get<UserConnectionAPI.GetUserConnectionsResponse>(
        '/userconnection/get-user-connections'
      );
    return response.data.data;
  }

  // 10. Find New Connections (Suggestions)
  async findConnections(
    params?: UserConnectionAPI.FindConnectionParams
  ): Promise<UserConnectionAPI.FindConnectionResponse['data']> {
    const response =
      await axiosClient.get<UserConnectionAPI.FindConnectionResponse>(
        '/userconnection/find-connection',
        { params }
      );
    return response.data.data;
  }
}

export const userConnectionAPI = new UserConnectionAPI_Handler();
