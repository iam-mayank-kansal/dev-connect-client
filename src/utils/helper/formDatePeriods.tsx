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
 * Constructs the full URL for an uploaded file.
 * @param fileName - The name of the file (e.g., "image.png").
 * @param dir - The subdirectory on the server (e.g., "profilePicture").
 * @returns The complete absolute URL to the resource.
 */
export const getImageUrl = (fileName: string, dir: string): string => {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${dir}/${fileName}`;
};
