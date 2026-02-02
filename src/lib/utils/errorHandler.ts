import axios, { AxiosError } from 'axios';

/**
 * Extracts a readable error message from various error types
 * @param error - Unknown error object
 * @returns Formatted error message string
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || error.message || 'An error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

/**
 * Formats API errors with additional context
 * @param error - Axios error object
 * @returns Formatted error object
 */
export const formatAPIError = (
  error: AxiosError
): {
  message: string;
  status?: number;
  code?: string;
} => {
  return {
    message: getErrorMessage(error),
    status: error.response?.status,
    code: error.code,
  };
};

/**
 * Safe error message for blog API calls
 * @param err - Unknown error
 * @returns User-friendly error message
 */
export const getBlogErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err) && err.response) {
    return err.response.data.message || 'Failed to fetch blogs.';
  }
  return 'An unexpected network error occurred.';
};
