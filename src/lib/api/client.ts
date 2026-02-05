import axios, { AxiosInstance } from 'axios';

// Create axios instance with base configuration
export const axiosClient: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect`,
  withCredentials: true,
  timeout: 10000,
});
