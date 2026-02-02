/**
 * Centralized validation utilities
 */

/**
 * Validates if a URL is a valid image URL (relative, http, or https)
 * @param url - The URL string to validate
 * @returns Boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  return (
    url.startsWith('/') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  );
};

/**
 * Validates if a string is a valid email
 * @param email - The email string to validate
 * @returns Boolean indicating if the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a string is not empty after trimming
 * @param value - The string to validate
 * @returns Boolean indicating if the string has content
 */
export const isNotEmpty = (value: string | null | undefined): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Validates if a string meets minimum length requirement
 * @param value - The string to validate
 * @param minLength - The minimum required length
 * @returns Boolean indicating if the string meets the requirement
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

/**
 * Validates if a string meets maximum length requirement
 * @param value - The string to validate
 * @param maxLength - The maximum allowed length
 * @returns Boolean indicating if the string meets the requirement
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};
