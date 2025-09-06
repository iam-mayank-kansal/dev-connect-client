import axios, { AxiosResponse } from 'axios';
import { UserProfile } from './types';

export const API_BASE_URL = 'http://localhost:8080';

export async function getUserProfile(): Promise<AxiosResponse<{ status: string; data: UserProfile }>> {
  return axios.get(`${API_BASE_URL}/devconnect/user/profile`, { withCredentials: true });
}

export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<AxiosResponse<UserProfile>> {
  return axios.patch(`${API_BASE_URL}/devconnect/user/update-user`, profileData, {
    withCredentials: true,
     headers: {
      'Content-Type': 'multipart/form-data' 
    }
  });
}