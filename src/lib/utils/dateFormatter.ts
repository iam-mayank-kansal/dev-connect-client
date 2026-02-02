/**
 * Centralized date formatting utilities
 */

/**
 * Calculates the age based on a date of birth string.
 * @param dobString - The date of birth (e.g., "YYYY-MM-DD") or null/undefined.
 * @returns The calculated age as a number, or 'N/A' if no DOB is provided.
 */
export const calculateAge = (
  dobString: string | null | undefined
): number | 'N/A' => {
  if (!dobString) return 'N/A';

  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Formats an ISO date string into a relative time format (e.g., "5m", "2h", "3d").
 * @param dateString - The ISO date string from the backend.
 * @returns A short, formatted string representing the time elapsed.
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}y`;

  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}mo`;

  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}d`;

  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}h`;

  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}m`;

  return `${Math.floor(seconds)}s`;
};

/**
 * Formats an ISO date string into a verbose relative time format (e.g., "5 minutes ago", "2 hours ago").
 * Used for blogs to show more detailed time information.
 * @param dateString - The ISO date string from the backend.
 * @returns A verbose formatted string representing the time elapsed.
 */
export const formatBlogDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));
      return `${diffMinutes}m ago`;
    }
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)}mo ago`;
  return date.toLocaleDateString();
};

/**
 * Formats a start and end date into a year-based period string.
 * @param startDateString - The required start date (e.g., "YYYY-MM-DD").
 * @param endDateString - The optional end date. If falsy, "Present" is used.
 * @returns A formatted string (e.g., "2020 - 2022" or "2023 - Present").
 */
export const formatDatePeriod = (
  startDateString: string,
  endDateString: string | null | undefined
): string => {
  const start = new Date(startDateString).getFullYear();
  if (!endDateString) {
    return `${start} - Present`;
  }
  const end = new Date(endDateString).getFullYear();
  return `${start} - ${end}`;
};

/**
 * Check if blog was created recently (within 24 hours)
 */
export const isBlogRecent = (dateString: string): boolean => {
  const blogDate = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - blogDate.getTime();
  const diffHours = diffTime / (1000 * 60 * 60);
  return diffHours < 24;
};
