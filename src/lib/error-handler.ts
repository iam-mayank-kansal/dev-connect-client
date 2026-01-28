import axios from 'axios';

export function getErrorMessage(error: unknown): string {
  // Check for Axios-specific server messages first
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  return 'Something went wrong';
}
