import axios from 'axios';

export function getUserProfile() {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect/user/profile`,
    {
      withCredentials: true,
    }
  );
}
