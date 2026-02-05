import { axiosClient } from '../client';

interface SearchUser {
  _id: string;
  name: string;
  profilePicture: string;
  designation: string;
}

class SearchAPI_Handler {
  async searchUsers(query: string): Promise<SearchUser[]> {
    try {
      const response = await axiosClient.get<SearchUser[]>(
        `/user/search?q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
}

export const searchAPI = new SearchAPI_Handler();
