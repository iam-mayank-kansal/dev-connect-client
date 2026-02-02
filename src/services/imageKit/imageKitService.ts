import { authAPI } from '@/lib/api/handlers/auth';

class ImageKitService {
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
}

export const imageKitService = new ImageKitService();
