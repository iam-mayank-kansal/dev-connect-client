import { Blog } from '@/lib/types/blog';

/**
 * Sort blogs by creation date (newest first)
 */
export function sortBlogsByDate(blogs: Blog[]): Blog[] {
  return blogs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Format blog creation date to readable format
 */
export function formatBlogDate(dateString: string): string {
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
}

/**
 * Check if blog was created recently (within 24 hours)
 */
export function isBlogRecent(dateString: string): boolean {
  const blogDate = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - blogDate.getTime();
  const diffHours = diffTime / (1000 * 60 * 60);
  return diffHours < 24;
}

/**
 * Filter blogs by search term
 */
export function filterBlogsBySearch(blogs: Blog[], searchTerm: string): Blog[] {
  const term = searchTerm.toLowerCase();
  return blogs.filter(
    (blog) =>
      blog.blogTitle.toLowerCase().includes(term) ||
      blog.blogBody.toLowerCase().includes(term) ||
      blog.userId.name.toLowerCase().includes(term)
  );
}

/**
 * Get reaction statistics
 */
export function getBlogReactionStats(blog: Blog) {
  return {
    agreedCount: blog.reactions?.agreed?.length || 0,
    disagreedCount: blog.reactions?.disagreed?.length || 0,
    totalReactions:
      (blog.reactions?.agreed?.length || 0) +
      (blog.reactions?.disagreed?.length || 0),
  };
}

/**
 * Check if user has reacted to blog
 */
export function hasUserReacted(
  blog: Blog,
  userId: string
): 'agreed' | 'disagreed' | null {
  if (blog.reactions?.agreed?.includes(userId)) {
    return 'agreed';
  }
  if (blog.reactions?.disagreed?.includes(userId)) {
    return 'disagreed';
  }
  return null;
}

/**
 * Truncate blog content for preview
 */
export function truncateBlogContent(
  content: string,
  maxChars: number = 200
): string {
  if (content.length <= maxChars) return content;
  return content.substring(0, maxChars) + '...';
}

/**
 * Extract excerpt from blog body
 */
export function getBlogExcerpt(blog: Blog, maxChars: number = 150): string {
  return truncateBlogContent(blog.blogBody, maxChars);
}
