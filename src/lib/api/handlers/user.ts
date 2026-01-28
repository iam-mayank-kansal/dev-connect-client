import { axiosClient } from '@/lib/api/client';
import { User } from '@/lib/types/entities';

export const userAPI = {
  async getUserProfile(id: string) {
    const response = await axiosClient.get(`/user/profile/${id}`);
    return response.data.data;
  },

  async updateUserProfile(data: Partial<User>) {
    const response = await axiosClient.patch('/user/update-user', data);
    return response.data;
  },
};
