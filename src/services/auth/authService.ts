// services/auth/authService.ts
import { authAPI } from '../../lib/api/handlers/auth';
import { AuthAPI } from '@/lib/types/api/auth';
import { User } from '../../lib/types/entities';

class AuthService {
  async checkAuth(): Promise<{ user: User } | null> {
    try {
      const data = await authAPI.checkAuth();
      if (!data) return null;
      return { user: data };
    } catch (error) {
      console.error('Check auth failed:', error);
      return null;
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token?: string }> {
    try {
      const response = await authAPI.login({ email, password });
      if (!response.data)
        throw new Error('Login succeeded but no user data received');
      return {
        user: response.data,
        token: response.token, // Get token from response
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async signUp(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User }> {
    try {
      const data = await authAPI.signUp({ name, email, password });
      if (!data) throw new Error('Signup succeeded but no user data received');
      return { user: data };
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async sendPasswordResetOTP(email: string): Promise<string> {
    try {
      const data = await authAPI.sendOTP({ email });
      return data.message;
    } catch (error) {
      console.error('Send OTP failed:', error);
      throw error;
    }
  }

  async verifyPasswordResetOTP(
    email: string,
    otp: string
  ): Promise<AuthAPI.VerifyOTPResponse> {
    try {
      const data = await authAPI.verifyOTP({ email, otp });
      return data;
    } catch (error) {
      console.error('Verify OTP failed:', error);
      throw error;
    }
  }

  // FIXED: Implemented the body and connected it to the API
  async setNewPassword(
    resetToken: string,
    newPassword: string
  ): Promise<string> {
    try {
      // Assuming you have an endpoint for this in your authAPI handler
      const data = await authAPI.setNewPassword({ resetToken, newPassword });
      return data.message;
    } catch (error) {
      console.error('Set new password failed:', error);
      throw error;
    }
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<string> {
    try {
      const data = await authAPI.changePassword({ oldPassword, newPassword });
      return data.message;
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
