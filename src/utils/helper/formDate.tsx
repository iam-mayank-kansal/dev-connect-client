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
