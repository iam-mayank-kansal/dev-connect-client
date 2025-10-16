// --- TypeScript Type Definitions ---

export interface PopulatedUser {
  name: string;
  profilePicture?: string;
  designation?: string;
}

export interface Blog {
  _id: string;
  blogTitle: string;
  blogBody: string;
  blogPhoto: string[];
  blogViedo: string[]; // Note: This matches the typo from your API
  userId: PopulatedUser;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
}

export interface BlogListApiResponse {
  data: Blog[];
  message?: string;
}
