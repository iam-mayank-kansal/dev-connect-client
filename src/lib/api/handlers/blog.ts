import axios from 'axios';
import { BlogAPI } from '@/lib/types/api/blog';
import { axiosInstanace } from '../client';
import { Blog } from '@/lib/types/blog';

class BlogAPI_Handler {
  // CREATE
  async createBlog(
    data: BlogAPI.CreateBlogRequest
  ): Promise<BlogAPI.CreateBlogResponse['data']> {
    const response = await axiosInstanace.post<BlogAPI.CreateBlogResponse>(
      '/blog/create-blog',
      data
    );
    return response.data.data;
  }

  // READ - All Blogs with Pagination
  async getAllBlogs(
    page: number = 1,
    limit: number = 10
  ): Promise<BlogAPI.FetchBlogsResponse['data']> {
    const response = await axiosInstanace.get<BlogAPI.FetchBlogsResponse>(
      `/blog/fetch-blogs?page=${page}&limit=${limit}`
    );
    return response.data.data;
  }

  // READ - User's Blogs with Pagination
  async getUserBlogs(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<BlogAPI.FetchUserBlogsResponse['data']> {
    try {
      const response = await axiosInstanace.get<BlogAPI.FetchUserBlogsResponse>(
        `/blog/fetch-user-blogs/${userId}?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error: unknown) {
      // Handle empty blogs case - return empty array instead of throwing error
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 400 || error.response?.status === 404)
      ) {
        return {
          blogs: [],
          pagination: {
            currentPage: page,
            limit,
            totalCount: 0,
            totalPages: 0,
          },
        };
      }
      throw error;
    }
  }

  // READ - Single Blog by ID
  async getBlogById(blogId: string): Promise<Blog> {
    const response = await axiosInstanace.get<BlogAPI.FetchBlogByIdResponse>(
      `/blog/fetch-blog/${blogId}`
    );
    return response.data.data;
  }

  // UPDATE
  async editBlog(
    blogId: string,
    data: Partial<Blog>
  ): Promise<BlogAPI.EditBlogResponse['data']> {
    const payload = { ...data, blogId };
    const response = await axiosInstanace.patch<BlogAPI.EditBlogResponse>(
      '/blog/edit-blog',
      payload
    );
    return response.data.data;
  }

  // DELETE
  async deleteBlog(
    blogId: string
  ): Promise<BlogAPI.DeleteBlogResponse['data']> {
    const response = await axiosInstanace.patch<BlogAPI.DeleteBlogResponse>(
      '/blog/delete-blog',
      { blogId }
    );
    return response.data.data;
  }

  // REACTIONS
  async reactToBlog(
    blogId: string,
    reaction: 'agree' | 'disagree' | ''
  ): Promise<BlogAPI.ReactBlogResponse['data']> {
    const response = await axiosInstanace.put<BlogAPI.ReactBlogResponse>(
      '/blog/react-blog',
      { blogId, reaction }
    );
    return response.data.data;
  }
}

export const blogAPI = new BlogAPI_Handler();
