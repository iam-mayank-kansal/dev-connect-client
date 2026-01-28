import { User } from '../entities';

export namespace UserConnectionAPI {
  // get user connections API
  export interface GetUserConnectionsResponse {
    responseCode: number;
    status: string;
    message: string;
    data: {
      connected?: User[];
      requestSent?: User[];
      requestReceived?: User[];
      blocked?: User[];
      ignored?: User[];
    };
  }

  //   send connection request API
  export interface SendConnectionRequest {
    toUserId: string;
  }

  export interface SendConnectionResponse {
    responseCode: number;
    status: string;
    message: string;
    data: {
      toUserData: User;
    };
  }

  //   suspend connection request API
  export interface SuspendConnectionRequest {
    toUserId: string;
  }

  export interface SuspendConnectionResponse {
    responseCode: number;
    status: string;
    message: string;
    data: {
      toUserId: string;
    };
  }

  //   accept/reject connection request API
  export interface ConnectionResponseRequest {
    fromUserId: string;
    status: 'accepted' | 'rejected';
  }

  export interface ConnectionResponseResponse {
    responseCode: number;
    status: string;
    message: string;
    data: {
      fromUserId: string;
      toUserId: string;
      status: 'accepted' | 'rejected';
    };
  }

  //   delete connection API
  export interface DeleteConnectionRequest {
    toUserId: string;
  }

  export interface DeleteConnectionResponse {
    responseCode: number;
    status: string;
    message: string;
    data: {
      fromUserId: string;
      toUserId: string;
      action: 'deleted';
    };
  }

  // block user API
  export interface BlockUserRequest {
    toUserId: string;
  }

  export interface BlockUserResponse {
    responseCode: number;
    status: string;
    message: string;
    data: {
      status: 'blocked';
      blockedUser: User;
    };
  }

  // unblock user API
  export interface UnblockUserRequest {
    toUserId: string;
  }

  export interface UnblockUserResponse {
    responseCode: number;
    status: string;
    message: string;
    data: {
      status: 'unblocked';
      toUserId: string;
    };
  }

  // ignore user API
  export interface IgnoreUserRequest {
    toUserId: string;
  }

  export interface IgnoreUserResponse {
    responseCode: number;
    status: string;
    message: string;
    data: {
      ignoredUser: User;
      status: 'ignored';
    };
  }

  // unignore user API
  export interface UnignoreUserRequest {
    toUserId: string;
  }

  export interface UnignoreUserResponse {
    responseCode: number;
    status: string;
    message: string;
    data: {
      status: 'unignored';
      toUserId: string;
    };
  }

  export interface FindConnectionParams {
    page?: number;
    limit?: number;
  }

  export interface FindConnectionResponse {
    responseCode: number;
    status: string;
    message: string;
    data: {
      users: User[];
      pagination: {
        currentPage: number;
        limit: number;
        hasMore: boolean;
        totalPages?: number;
        totalUsers?: number;
      };
    };
  }
}
