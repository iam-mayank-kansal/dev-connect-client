'use client';

import React,
{
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  FC,
  Dispatch,
  SetStateAction
} from 'react';
import axios, { AxiosResponse } from 'axios';
import { FileText, Video, X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

// --- Type Definitions ---

// Defines the structure of the data sent to the API function
interface BlogData {
  blogTitle: string;
  blogBody: string;
  contentPhoto: File[];
  contentViedo: File[]; // Matches the backend's expected field name
}

// Defines the expected successful API response (customize as needed)
interface BlogApiResponse {
  message: string;
  data: {
    // Define the structure of the returned blog object
    _id: string;
    blogTitle: string;
    blogBody: string;
    // ... other fields
  };
}

// --- API Service Function ---

/**
 * Creates a new blog post by sending multipart/form-data to the API.
 * This function is modeled after the provided updateUserProfile example.
 * @param blogData - The blog data including title, body, and files.
 * @returns An AxiosResponse containing the server's response.
 */
export async function createBlogPost(blogData: BlogData): Promise<AxiosResponse<BlogApiResponse>> {
  const formData = new FormData();

  // Iterate over the blogData and append to FormData
  Object.entries(blogData).forEach(([key, value]) => {
    // Handle the file arrays
    if (key === 'contentPhoto' || key === 'contentViedo') {
      if (Array.isArray(value)) {
        value.forEach((file) => {
          // Append each file with the same key. Multer will interpret this as an array.
          formData.append(key, file);
        });
      }
    } 
    // Handle primitive string values
    else if (typeof value === 'string') {
      formData.append(key, value);
    }
  });
  
  // Note: Using an environment variable for the API URL is a best practice.
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect/blog/create-blog`;

  return axios.post(apiUrl, formData, {
    // IMPORTANT: In a real app, you would get the token from your auth context/state management
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer YOUR_AUTH_TOKEN_HERE`,
    },
    withCredentials: true, // If you use cookie-based sessions
  });
}


// --- Helper Components (Typed) ---

interface AlertMessageProps {
  message: string;
  type: 'error' | 'success';
}

const AlertMessage: FC<AlertMessageProps> = ({ message, type }) => {
  if (!message) return null;

  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-100' : 'bg-green-100';
  const textColor = isError ? 'text-red-800' : 'text-green-800';
  const Icon = isError ? AlertTriangle : CheckCircle;

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-md flex items-center gap-3 my-4`}>
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

const FilePreview: FC<FilePreviewProps> = ({ files, onRemove }) => {
  // ... implementation remains the same
  if (files.length === 0) return null;
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (file.type.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };
  return (
    <div className="mt-4 space-y-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border rounded-md">
          <div className="flex items-center gap-3 overflow-hidden">
            {getFileIcon(file)}
            <span className="text-sm text-gray-700 font-medium truncate">{file.name}</span>
            <span className="text-xs text-gray-500 flex-shrink-0">
              ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0 ml-2"
          ><X className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
};


// --- Main Component ---

const CreateBlog: FC = () => {
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [blogBody, setBlogBody] = useState<string>('');
  const [contentPhotos, setContentPhotos] = useState<File[]>([]);
  const [contentVideos, setContentVideos] = useState<File[]>([]);
  
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // File handling logic remains the same
  interface FileValidation { maxCount: number; maxSize: number; type: 'Photo' | 'Video'; }
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFiles: Dispatch<SetStateAction<File[]>>, currentFiles: File[], validation: FileValidation) => { /* ... same as before */ 
    setError('');
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (newFiles.length === 0) return;
    if ((currentFiles.length + newFiles.length) > validation.maxCount) {
      setError(`You can only upload a maximum of ${validation.maxCount} ${validation.type}s. You have ${currentFiles.length} selected.`);
      if (e.target) e.target.value = ''; return;
    }
    for (const file of newFiles) {
      if (file.size > validation.maxSize) {
        setError(`${validation.type} "${file.name}" exceeds the size limit of ${validation.maxSize / (1024 * 1024)}MB.`);
        if (e.target) e.target.value = ''; return;
      }
    }
    setFiles(prev => [...prev, ...newFiles]);
    if (e.target) e.target.value = '';
  };
  const removeFile = (index: number, setFiles: Dispatch<SetStateAction<File[]>>) => { setFiles(prev => prev.filter((_, i) => i !== index)); };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (blogTitle.trim().length === 0 || blogBody.trim().length === 0) {
      setError('Blog title and body cannot be empty.');
      setLoading(false);
      return;
    }
    
    // Prepare data for the API service function
    const blogPostData: BlogData = {
      blogTitle: blogTitle.trim(),
      blogBody: blogBody.trim(),
      contentPhoto: contentPhotos,
      contentViedo: contentVideos,
    };
    
    try {
      // Call the dedicated API function
      const response = await createBlogPost(blogPostData);
      
      setSuccess(response.data.message || 'Blog post created successfully!');
      
      // Reset form
      setBlogTitle('');
      setBlogBody('');
      setContentPhotos([]);
      setContentVideos([]);

    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        // Use the error message from the backend if available
        setError(err.response.data.message || 'An error occurred while creating the post.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create a New Blog Post</h1>
          <p className="text-gray-500 mb-8">Share your thoughts, stories, and ideas with the community.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && <AlertMessage message={error} type="error" />}
            {success && <AlertMessage message={success} type="success" />}

            {/* Form fields are unchanged */}
            <div>
              <label htmlFor="blogTitle" className="block text-sm font-semibold text-gray-700">Blog Title</label>
              <div className="mt-1">
                <input type="text" id="blogTitle" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} maxLength={200} required className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., My Journey into Web Development" />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-right">{blogTitle.length} / 200</p>
            </div>
            <div>
              <label htmlFor="blogBody" className="block text-sm font-semibold text-gray-700">Blog Content</label>
              <div className="mt-1">
                <textarea id="blogBody" rows={10} value={blogBody} onChange={(e) => setBlogBody(e.target.value)} maxLength={10000} required className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Write your blog content here..." />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-right">{blogBody.length} / 10000</p>
            </div>
            <div>
              <label htmlFor="contentPhoto" className="block text-sm font-semibold text-gray-700">Add Photos ({contentPhotos.length} / 10)</label>
              <div className="mt-1">
                <input id="contentPhoto" ref={photoInputRef} type="file" multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => handleFileChange(e, setContentPhotos, contentPhotos, { maxCount: 10, maxSize: 2 * 1024 * 1024, type: 'Photo' })} />
              </div>
              <FilePreview files={contentPhotos} onRemove={(index) => removeFile(index, setContentPhotos)} />
            </div>
            <div>
              <label htmlFor="contentViedo" className="block text-sm font-semibold text-gray-700">Add Videos ({contentVideos.length} / 2)</label>
              <div className="mt-1">
                <input id="contentViedo" ref={videoInputRef} type="file" multiple accept="video/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" onChange={(e) => handleFileChange(e, setContentVideos, contentVideos, { maxCount: 2, maxSize: 70 * 1024 * 1024, type: 'Video' })} />
              </div>
              <FilePreview files={contentVideos} onRemove={(index) => removeFile(index, setContentVideos)} />
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Publishing...</> : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateBlog;
