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
