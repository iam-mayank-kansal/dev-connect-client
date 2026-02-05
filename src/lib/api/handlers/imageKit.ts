import { ImageKitAPI } from '@/lib/types/api/imageKit';
import { axiosClient } from '../client';

class ImageKitAPI_Handler {
  async getImageKitAuth(): Promise<ImageKitAPI.ImageKitAuthResponse> {
    const response = await axiosClient.get<ImageKitAPI.ImageKitAuthResponse>(
      '/auth/imageKit-access'
    );
    return response.data;
  }

  async deleteImageKitResource(
    data: ImageKitAPI.DeleteImageKitRequest
  ): Promise<ImageKitAPI.DeleteImageKitResponse> {
    const response =
      await axiosClient.delete<ImageKitAPI.DeleteImageKitResponse>(
        '/auth/imagekit-delete',
        { data }
      );
    return response.data;
  }
}

export const imageKitAPI = new ImageKitAPI_Handler();
