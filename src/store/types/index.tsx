import { User } from '@/lib/types/entities';
import { Socket } from 'socket.io-client';

export interface AuthStore {
  // STATE
  authUser: User | null;
  isCheckingAuth: boolean;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isLoggingOut: boolean;
  isSendingOTP: boolean;
  isVerifyingOTP: boolean;
  isChangingPassword: boolean;
  isSettingNewPassword: boolean;
  resetToken: string | null;
  socket: Socket | null;
  onlineUsers: string[];
  error: string | null;

  // ACTIONS
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordResetOTP: (email: string) => Promise<void>;
  verifyPasswordResetOTP: (email: string, otp: string) => Promise<void>;
  changePassword: (
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
  setNewPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  connectToSocket: () => void;
  disconnectFromSocket: () => void;
  clearError: () => void;
}
export interface UserStore {
  profileUser: User | null;
  connectionStatus:
    | 'self'
    | 'connected'
    | 'requestSent'
    | 'requestReceived'
    | 'blocked'
    | 'ignored'
    | 'not_connected'
    | null;
  isLoadingProfile: boolean;
  error: string | null;

  // ACTIONS
  fetchUserProfile: (userId: string) => Promise<void>;
  clearProfile: () => void;
  setProfileUser: (user: User) => void;
  setConnectionStatus: (
    status:
      | 'self'
      | 'connected'
      | 'requestSent'
      | 'requestReceived'
      | 'blocked'
      | 'ignored'
      | 'not_connected'
      | null
  ) => void;
}
export interface ConnectionStore {
  // states
  connected?: User[];
  requestSent?: User[];
  requestReceived?: User[];
  blocked?: User[];
  ignored?: User[];
  isLoading: boolean;

  error: string | null;

  // actions
  getUserConnections: () => Promise<void>;
  sendRequest: (userId: string) => Promise<void>;
  suspendRequest: (userId: string) => Promise<void>;
  acceptRequest: (userId: string) => Promise<void>;
  deleteConnection: (userId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  ignoreUser: (userId: string) => Promise<void>;
  unignoreUser: (userId: string) => Promise<void>;
}
