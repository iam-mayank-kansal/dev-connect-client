import axios, { AxiosInstance } from 'axios';

// Create axios instance with base configuration
// Using /api proxy to make requests appear same-origin for cookie support
export const axiosClient: AxiosInstance = axios.create({
  baseURL: '/api/devconnect',
  withCredentials: true,
  timeout: 10000,
});

// For backward compatibility
export const axiosInstanace = axiosClient;
