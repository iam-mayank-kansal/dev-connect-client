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
