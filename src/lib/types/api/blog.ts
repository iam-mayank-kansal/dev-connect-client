import { Blog } from '../blog';

export namespace BlogAPI {
  // ============ REQUEST TYPES ============

  export interface CreateBlogRequest {
    blogTitle: string;
    blogBody: string;
    uploadedPhotos: {
      url: string;
      fileId: string;
    }[];
    uploadedVideos: {
      url: string;
      fileId: string;
    }[];
  }

  export interface EditBlogRequest {
    blogId: string;
    blogTitle: string;
    blogBody: string;
  }

  export interface ReactBlogRequest {
    blogId: string;
    reaction: 'agree' | 'disagree' | '';
  }

  // ============ RESPONSE TYPES ============

  // Generic API Response Wrapper
  interface BaseResponse {
    responseCode: number;
    status: 'success' | 'failure';
    message: string;
  }

  // Create Blog Response
  export interface CreateBlogResponse extends BaseResponse {
    data?: Blog;
  }

  // Fetch All Blogs Response
  export interface FetchBlogsResponse extends BaseResponse {
    data: {
      blogs: Blog[];
      pagination: {
        currentPage: number;
        limit: number;
        totalCount: number;
        totalPages: number;
      };
    };
  }

  // Fetch User Blogs Response (same structure as FetchBlogsResponse)
  export interface FetchUserBlogsResponse extends BaseResponse {
    data: {
      blogs: Blog[];
      pagination: {
        currentPage: number;
        limit: number;
        totalCount: number;
        totalPages: number;
      };
    };
  }

  // Fetch Single Blog Response
  export interface FetchBlogByIdResponse extends BaseResponse {
    data: Blog;
  }

  // Edit Blog Response
  export interface EditBlogResponse extends BaseResponse {
    data?: Blog;
  }

  // Delete Blog Response
  export interface DeleteBlogResponse extends BaseResponse {
    data?: Blog;
  }

  // React to Blog Response
  export interface ReactBlogResponse extends BaseResponse {
    data: {
      postId: string;
      agreedCount: number;
      disagreedCount: number;
    };
  }
}
