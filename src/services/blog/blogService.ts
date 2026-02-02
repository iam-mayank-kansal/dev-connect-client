import { blogAPI } from '@/lib/api/handlers/blog';
import { Blog } from '@/lib/types/blog';
import { BlogAPI } from '@/lib/types/api/blog';
import { getErrorMessage } from '@/lib/utils/errorHandler';

class BlogService {
  /**
   * Create a new blog post
   */
  async createBlog(data: BlogAPI.CreateBlogRequest): Promise<Blog | undefined> {
    try {
      const response = await blogAPI.createBlog(data);
      if (!response) {
        throw new Error('Failed to create blog: No response data');
      }
      return response;
    } catch (error) {
      console.error('Create blog failed:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Fetch all blogs with pagination
   */
  async getAllBlogs(
    page: number = 1,
    limit: number = 10
  ): Promise<BlogAPI.FetchBlogsResponse['data']> {
    try {
      const response = await blogAPI.getAllBlogs(page, limit);
      return response;
    } catch (error) {
      console.error('Fetch all blogs failed:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Fetch user's blogs with pagination
   */
  async getUserBlogs(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<BlogAPI.FetchUserBlogsResponse['data']> {
    try {
      const response = await blogAPI.getUserBlogs(userId, page, limit);
      return response;
    } catch (error) {
      console.error('Fetch user blogs failed:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Fetch a single blog by ID
   */
  async getBlogById(blogId: string): Promise<Blog> {
    try {
      const response = await blogAPI.getBlogById(blogId);
      return response;
    } catch (error) {
      console.error('Fetch blog by ID failed:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Edit an existing blog
   */
  async editBlog(
    blogId: string,
    data: Partial<Blog>
  ): Promise<Blog | undefined> {
    try {
      const response = await blogAPI.editBlog(blogId, data);
      if (!response) {
        throw new Error('Failed to edit blog: No response data');
      }
      return response;
    } catch (error) {
      console.error('Edit blog failed:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Delete a blog
   */
  async deleteBlog(blogId: string): Promise<Blog | undefined> {
    try {
      const response = await blogAPI.deleteBlog(blogId);
      return response;
    } catch (error) {
      console.error('Delete blog failed:', error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * React to a blog (agree/disagree)
   */
  async reactToBlog(
    blogId: string,
    reaction: 'agree' | 'disagree' | ''
  ): Promise<BlogAPI.ReactBlogResponse['data']> {
    try {
      const response = await blogAPI.reactToBlog(blogId, reaction);
      return response;
    } catch (error) {
      console.error('React to blog failed:', error);
      throw new Error(getErrorMessage(error));
    }
  }
}

export const blogService = new BlogService();
