import { User } from '../entities';

// ============= USER API =============
export namespace UserAPI {
  export interface GetUserProfileRequest {
    id: string;
  }

  export interface GetUserProfileResponse {
    responseCode: number;
    status: string;
    message: string;
    data?: {
      user: User;
      status: 'self' | 'connected' | 'requested' | 'none';
    };
  }
}
