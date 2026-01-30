import axios from 'axios';

export const axiosInstanace = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect`,
  withCredentials: true,
  timeout: 30000, // 30 seconds - give backend time to connect to MongoDB
});
