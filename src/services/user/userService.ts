import { userAPI } from '@/lib/api/handlers/user';
import { User } from '@/lib/types/entities';

class UserService {
  async getUserProfile(
    id: string
  ): Promise<
    { user: User; status: string } | { user: null; status?: undefined }
  > {
    try {
      const data = await userAPI.getUserProfile(id);
      if (!data || !data.user)
        return {
          user: null,
        };
      return { user: data.user, status: data.status };
    } catch (error) {
      console.error('Get user profile failed:', error);
      return { user: null };
    }
  }

  async updateUserProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await userAPI.updateUserProfile(data);
      return response.data;
    } catch (error) {
      console.error('Update user profile failed:', error);
      throw error;
    }
  }

  async deleteUser(password: string): Promise<{ message: string }> {
    try {
      const response = await userAPI.deleteUser(password);
      return response;
    } catch (error) {
      console.error('Delete user failed:', error);
      throw error;
    }
  }
}
export const userService = new UserService();
