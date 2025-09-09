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