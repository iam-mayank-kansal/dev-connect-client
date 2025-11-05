/**
 * Constructs the full URL for an uploaded file.
 * @param fileName - The name of the file (e.g., "image.png").
 * @param dir - The subdirectory on the server (e.g., "profilePicture").
 * @returns The complete absolute URL to the resource.
 */
export const getImageUrl = (fileName: string, dir: string): string => {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${dir}/${fileName}`;
};
