/**
 * Constructs the full URL for a media file.
 * @param filename - The name of the media file from the API.
 * @param type - The category of the media ('images', 'videos', 'profilePicture').
 * @returns The complete URL to the asset.
 */
export const getMediaUrl = (
  filename: string,
  type: 'images' | 'videos' | 'profilePicture'
): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  if (type === 'profilePicture') {
    return `${baseUrl}/uploads/profilePicture/${filename}`;
  }
  return `${baseUrl}/uploads/blogs/${type}/${filename}`;
};
