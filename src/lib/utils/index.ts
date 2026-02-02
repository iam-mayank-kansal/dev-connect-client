/**
 * Centralized utilities index
 * Re-exports all organized utility functions for convenient imports
 */

// Date formatting utilities
export {
  calculateAge,
  formatDate,
  formatBlogDate,
  formatDatePeriod,
  isBlogRecent,
} from './dateFormatter';

// Media and URL utilities
export { getImageUrl, getMediaUrl, isValidImageUrl } from './media';

// Blog utilities
export {
  sortBlogsByDate,
  filterBlogsBySearch,
  getBlogReactionStats,
  hasUserReacted,
  truncateBlogContent,
  getBlogExcerpt,
} from './blog';

// Validation utilities
export {
  isValidUrl,
  isValidEmail,
  isNotEmpty,
  hasMinLength,
  hasMaxLength,
} from './validators';

// Error handling utilities
export {
  getErrorMessage,
  formatAPIError,
  getBlogErrorMessage,
} from './errorHandler';
