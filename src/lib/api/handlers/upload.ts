import { axiosClient } from '@/lib/api/client';

export const uploadAPI = {
  // Generic upload function for any file (image or pdf)
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    // This hits your POST /api/upload route
    const response = await axiosClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Assuming backend returns { success: true, data: { url: "..." } }
    return response.data.data.url;
  },
};
