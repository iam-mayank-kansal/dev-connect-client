import { userAPI } from '@/lib/api/handlers/user';
import { authAPI } from '@/lib/api/handlers/auth';
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

  async getImageKitAuth(): Promise<{
    signature: string;
    expire: number;
    token: string;
  }> {
    try {
      const data = await authAPI.getImageKitAuth();
      return data;
    } catch (error) {
      console.error('Get ImageKit auth failed:', error);
      throw error;
    }
  }

  async deleteImageKitResource(fileId: string): Promise<void> {
    try {
      await authAPI.deleteImageKitResource({ fileId });
    } catch (error) {
      console.error('Delete ImageKit resource failed:', error);
      throw error;
    }
  }

  async uploadFile(file: File, folder: string) {
    const { signature, expire, token } = await this.getImageKitAuth();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append(
      'publicKey',
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ''
    );
    formData.append('signature', signature);
    formData.append('expire', expire.toString());
    formData.append('token', token);
    formData.append('useUniqueFileName', 'true');
    formData.append('folder', folder);

    const response = await fetch(
      process.env.NEXT_PUBLIC_IMAGEKIT_UPLOAD_URL || '',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return { url: data.url, fileId: data.fileId };
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
}
export const userService = new UserService();
