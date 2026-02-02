/**
 * Centralized media and URL utilities
 */

/**
 * Constructs the full URL for an uploaded file.
 * @param fileName - The name of the file (e.g., "image.png").
 * @param dir - The subdirectory on the server (e.g., "profilePicture").
 * @returns The complete absolute URL to the resource.
 */
export const getImageUrl = (fileName: string, dir: string): string => {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${dir}/${fileName}`;
};

/**
 * Constructs the full URL for a media file.
 * @param media - The media object or filename from the API.
 * @param type - The category of the media ('images', 'videos', 'profilePicture').
 * @returns The complete URL to the asset.
 */
export const getMediaUrl = (
  media: string | { url?: string; fileId?: string },
  type: 'images' | 'videos' | 'profilePicture'
): string => {
  // If media is already a URL object from ImageKit
  if (typeof media === 'object' && media.url) {
    return media.url;
  }

  // If media is a string (filename for old format or profilePicture)
  if (typeof media === 'string') {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    if (type === 'profilePicture') {
      return `${baseUrl}/uploads/profilePicture/${media}`;
    }
    return `${baseUrl}/uploads/blogs/${type}/${media}`;
  }

  // Fallback
  return '';
};

/**
 * Validates if a URL is valid (relative, http, or https)
 * @param url - The URL string to validate
 * @returns Boolean indicating if the URL is valid
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  return (
    url.startsWith('/') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  );
};
