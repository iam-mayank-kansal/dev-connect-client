import { User } from '../entities';

// ============= AUTH API =============
export namespace AuthAPI {
  // login
  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface LoginResponse {
    responseCode: number;
    status: string;
    message: string;
    data?: User;
  }

  // sign up
  export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
  }

  export interface SignUpResponse {
    responseCode: number;
    status: string;
    message: string;
    data?: User;
  }

  // check auth
  export interface CheckAuthResponse {
    responseCode: number;
    status: string;
    message: string;
    data?: User;
  }

  // logout
  export interface LogoutResponse {
    responseCode: number;
    status: string;
    message: string;
  }

  // send otp
  export interface SendOTPRequest {
    email: string;
  }

  export interface SendOTPResponse {
    responseCode: number;
    status: string;
    message: string;
  }

  // verify otp
  export interface VerifyOTPRequest {
    email: string;
    otp: string;
  }

  export interface VerifyOTPResponse {
    responseCode: number;
    status: string;
    message: string;
    data?: {
      token: string;
      contact: string;
    };
  }

  // set new password
  export interface setNewPasswordRequest {
    resetToken: string;
    newPassword: string;
  }

  export interface setNewPasswordResponse {
    responseCode: number;
    status: string;
    message: string;
  }
  // reset password
  export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
  }

  export interface ChangePasswordResponse {
    responseCode: number;
    status: string;
    message: string;
  }

  // imagekit access
  export interface ImageKitAuthResponse {
    signature: string;
    expire: number;
    token: string;
  }

  // delete imagekit resource
  export interface DeleteImageKitRequest {
    fileId: string;
  }

  export interface DeleteImageKitResponse {
    responseCode: number;
    status: string;
    message: string;
  }
}
