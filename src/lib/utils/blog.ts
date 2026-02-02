/**
 * Centralized blog utilities (filtering, formatting, reactions)
 */

import { Blog } from '../types/blog';

/**
 * Sort blogs by creation date (newest first)
 */
export const sortBlogsByDate = (blogs: Blog[]): Blog[] => {
  return blogs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * Filter blogs by search term (searches title, body, and author name)
 */
export const filterBlogsBySearch = (
  blogs: Blog[],
  searchTerm: string
): Blog[] => {
  const term = searchTerm.toLowerCase();
  return blogs.filter(
    (blog) =>
      blog.blogTitle.toLowerCase().includes(term) ||
      blog.blogBody.toLowerCase().includes(term) ||
      blog.userId.name.toLowerCase().includes(term)
  );
};

/**
 * Get reaction statistics for a blog
 */
export const getBlogReactionStats = (blog: Blog) => {
  return {
    agreedCount: blog.reactions?.agreed?.length || 0,
    disagreedCount: blog.reactions?.disagreed?.length || 0,
    totalReactions:
      (blog.reactions?.agreed?.length || 0) +
      (blog.reactions?.disagreed?.length || 0),
  };
};

/**
 * Check if user has reacted to blog
 * @param blog - The blog object
 * @param userId - The user ID to check
 * @returns 'agreed', 'disagreed', or null
 */
export const hasUserReacted = (
  blog: Blog,
  userId: string
): 'agreed' | 'disagreed' | null => {
  if (blog.reactions?.agreed?.includes(userId)) {
    return 'agreed';
  }
  if (blog.reactions?.disagreed?.includes(userId)) {
    return 'disagreed';
  }
  return null;
};

/**
 * Truncate blog content for preview
 */
export const truncateBlogContent = (
  content: string,
  maxChars: number = 200
): string => {
  if (content.length <= maxChars) return content;
  return content.substring(0, maxChars) + '...';
};

/**
 * Extract excerpt from blog body (removes HTML tags if any)
 */
export const getBlogExcerpt = (
  content: string,
  maxChars: number = 150
): string => {
  // Remove common HTML tags for plain text preview
  const plainText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return truncateBlogContent(plainText, maxChars);
};
