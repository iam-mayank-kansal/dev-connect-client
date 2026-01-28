import { AuthAPI } from '@/lib/types/api/auth';
import { axiosClient } from '../client';

class AuthAPI_Handler {
  async checkAuth(): Promise<AuthAPI.CheckAuthResponse['data']> {
    const response =
      await axiosClient.get<AuthAPI.CheckAuthResponse>('/auth/check-auth');
    return response.data.data;
  }

  async login(
    credentials: AuthAPI.LoginRequest
  ): Promise<AuthAPI.LoginResponse['data']> {
    const response = await axiosClient.post<AuthAPI.LoginResponse>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  }

  async signUp(
    data: AuthAPI.SignUpRequest
  ): Promise<AuthAPI.SignUpResponse['data']> {
    const response = await axiosClient.post<AuthAPI.SignUpResponse>(
      '/auth/sign-up',
      data
    );
    return response.data.data;
  }

  async logout(): Promise<AuthAPI.LogoutResponse> {
    const response =
      await axiosClient.post<AuthAPI.LogoutResponse>('/auth/logout');
    return response.data;
  }

  async sendOTP(
    data: AuthAPI.SendOTPRequest
  ): Promise<AuthAPI.SendOTPResponse> {
    const response = await axiosClient.post<AuthAPI.SendOTPResponse>(
      '/otp/send-otp',
      data
    );
    return response.data;
  }

  async verifyOTP(
    data: AuthAPI.VerifyOTPRequest
  ): Promise<AuthAPI.VerifyOTPResponse> {
    const response = await axiosClient.post<AuthAPI.VerifyOTPResponse>(
      '/otp/verify-otp',
      data
    );
    return response.data;
  }

  async setNewPassword(
    data: AuthAPI.setNewPasswordRequest
  ): Promise<AuthAPI.setNewPasswordResponse> {
    const response = await axiosClient.patch<AuthAPI.setNewPasswordResponse>(
      '/auth/set-new-password',
      data
    );
    return response.data;
  }

  async changePassword(
    data: AuthAPI.ChangePasswordRequest
  ): Promise<AuthAPI.ChangePasswordResponse> {
    const response = await axiosClient.patch<AuthAPI.ChangePasswordResponse>(
      '/auth/reset-password',
      data
    );
    return response.data;
  }

  async getImageKitAuth(): Promise<AuthAPI.ImageKitAuthResponse> {
    const response = await axiosClient.get<AuthAPI.ImageKitAuthResponse>(
      '/auth/imageKit-access'
    );
    return response.data;
  }

  async deleteImageKitResource(
    data: AuthAPI.DeleteImageKitRequest
  ): Promise<AuthAPI.DeleteImageKitResponse> {
    const response = await axiosClient.delete<AuthAPI.DeleteImageKitResponse>(
      '/auth/imagekit-delete',
      { data }
    );
    return response.data;
  }
}

export const authAPI = new AuthAPI_Handler();
