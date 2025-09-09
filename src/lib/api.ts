import axios, { AxiosResponse } from 'axios';
import { UserProfile } from './types';

export const API_BASE_URL = 'https://dev-connect-server-524e.onrender.com';

export async function getUserProfile(): Promise<AxiosResponse<{ status: string; data: UserProfile }>> {
  return axios.get(`${API_BASE_URL}/devconnect/user/profile`, { withCredentials: true });
}
export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<AxiosResponse<UserProfile>> {
  console.log("Data Before Updating User : ", profileData);
  
  const formData = new FormData();
  
  // Handle each field appropriately
  Object.entries(profileData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // For arrays (including empty ones)
      if (value.length === 0) {
        // Explicitly add empty array indicator
        formData.append(key, JSON.stringify([]));
      } else {
        // Add each array item
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            // Correctly format the key using a template literal
            formData.append(`${key}[${index}]`, JSON.stringify(item));
          } else {
            // Correctly format the key using a template literal
            formData.append(`${key}[${index}]`, String(item));
          }
        });
      }
    } else if (value instanceof File) {
      // Handle file uploads
      formData.append(key, value);
    } else if (typeof value === 'object' && value !== null) {
      // Handle objects
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      // Handle primitive values
      formData.append(key, String(value));
    }
  });
  
  return axios.patch(`${API_BASE_URL}/devconnect/user/update-user`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export async function resetUserPassword(
  newPassword: string, 
  resetToken: string
): Promise<AxiosResponse<{ message: string }>> {
  return axios.patch(
    `${API_BASE_URL}/devconnect/user/set-new-password`,
    { newPassword, resetToken },
    { withCredentials: true }
  );
}
export async function loginUser(
  email: string, 
  password: string
): Promise<AxiosResponse<{ message: string }>> {
  return axios.patch(
    `${API_BASE_URL}/devconnect/auth/login`,
    { email, password },
    { withCredentials: true }
  );
}
export async function sendOtp(
  email: string
): Promise<AxiosResponse<{ message: string }>> {
  return axios.post(
    `${API_BASE_URL}/devconnect/otp/send-otp`,
    { email },
    { withCredentials: true }
  );
}
export interface SignUpResponse {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
export async function signUpUserApi(
  name: string,
  email: string,
  password: string
): Promise<AxiosResponse<SignUpResponse>> {
  return axios.post(
    `${API_BASE_URL}/devconnect/auth/sign-up`,
    { name, email, password },
    { withCredentials: true }
  );
}
export interface VerifyOtpResponse {
  message: string;
  data: {
    token: string; // token you’re passing to new-password
  };
}
export async function verifyOtp(
  email: string,
  otp: string
): Promise<AxiosResponse<VerifyOtpResponse>> {
  return axios.post(
    `${API_BASE_URL}/devconnect/otp/verify-otp`,
    { email, otp },
    { withCredentials: true }
  );
}
export async function logoutUser(): Promise<AxiosResponse<{ message: string }>> {
  return axios.post(
    `${API_BASE_URL}/devconnect/auth/logout`,
    {},
    { withCredentials: true }
  );
}