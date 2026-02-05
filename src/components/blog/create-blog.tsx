'use client';

import { getErrorMessage } from '@/lib/utils/errorHandler';
import { BlogAPI } from '@/lib/types/api/blog';
import { blogService } from '@/services/blog/blogService';
import { imageKitService } from '@/services/imageKit/imageKitService';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Image as ImageIcon, Video, X, Plus, Check } from 'lucide-react';
import Image from 'next/image';

interface CreateBlogProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBlogCreated?: () => void;
}

// Constants for file limits
const MAX_IMAGES = 5;
const MAX_VIDEOS = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const CreateBlog = ({
  isOpen: initialOpen = false,
  onClose: externalOnClose,
  onBlogCreated,
}: CreateBlogProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogBody, setBlogBody] = useState('');
  const [blogPhotos, setBlogPhotos] = useState<FileList | null>(null);
  const [blogVideos, setBlogVideos] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFileIndex, setUploadingFileIndex] = useState<{
    type: 'photo' | 'video';
    index: number;
  } | null>(null);
  const [uploadedPhotoIndexes, setUploadedPhotoIndexes] = useState<Set<number>>(
    new Set()
  );
  const [uploadedVideoIndexes, setUploadedVideoIndexes] = useState<Set<number>>(
    new Set()
  );
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    if (externalOnClose) externalOnClose();
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateImages = (files: FileList | null) => {
    if (!files) return;

    if (files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_IMAGE_SIZE) {
        toast.error(`Image "${files[i].name}" exceeds 5MB limit`);
        return;
      }
    }

    setBlogPhotos(files);
    setUploadedPhotoIndexes(new Set());
  };

  const validateVideos = (files: FileList | null) => {
    if (!files) return;

    if (files.length > MAX_VIDEOS) {
      toast.error(`Maximum ${MAX_VIDEOS} videos allowed`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_VIDEO_SIZE) {
        toast.error(`Video "${files[i].name}" exceeds 50MB limit`);
        return;
      }
    }

    setBlogVideos(files);
    setUploadedVideoIndexes(new Set());
  };

  const previewImages = () => {
    if (!blogPhotos) return [];
    return Array.from(blogPhotos).map((file) => URL.createObjectURL(file));
  };

  const previewVideos = () => {
    if (!blogVideos) return [];
    return Array.from(blogVideos).map((file) => URL.createObjectURL(file));
  };

  const removeImages = (index: number) => {
    if (!blogPhotos) return;
    const dataTransfer = new DataTransfer();
    Array.from(blogPhotos).forEach((file, i) => {
      if (i !== index) dataTransfer.items.add(file);
    });
    setBlogPhotos(dataTransfer.files);
    setUploadedPhotoIndexes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const removeVideo = (index: number) => {
    if (!blogVideos) return;
    const dataTransfer = new DataTransfer();
    Array.from(blogVideos).forEach((file, i) => {
      if (i !== index) dataTransfer.items.add(file);
    });
    setBlogVideos(dataTransfer.files);
    setUploadedVideoIndexes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  // now this function will upload files and return their data
  const processFileUploads = async (toastId: string) => {
    try {
      const uploadedPhotos = [];
      const uploadedVideos = [];

      if (blogPhotos) {
        for (let i = 0; i < blogPhotos.length; i++) {
          setUploadingFileIndex({ type: 'photo', index: i });
          toast.loading(`Uploading photo ${i + 1} of ${blogPhotos.length}...`, {
            id: toastId,
          });
          const file = blogPhotos[i];
          const res = await imageKitService.uploadFile(file, '/blog/images');
          uploadedPhotos.push({ url: res.url, fileId: res.fileId });

          // Mark this photo as uploaded
          setUploadedPhotoIndexes((prev) => new Set(prev).add(i));
        }
      }

      if (blogVideos) {
        for (let i = 0; i < blogVideos.length; i++) {
          setUploadingFileIndex({ type: 'video', index: i });
          toast.loading(`Uploading video ${i + 1} of ${blogVideos.length}...`, {
            id: toastId,
          });
          const file = blogVideos[i];
          const res = await imageKitService.uploadFile(file, '/blog/videos');
          uploadedVideos.push({ url: res.url, fileId: res.fileId });

          // Mark this video as uploaded
          setUploadedVideoIndexes((prev) => new Set(prev).add(i));
        }
      }

      setUploadingFileIndex(null);
      return { uploadedPhotos, uploadedVideos };
    } catch (err) {
      console.error('Error uploading files:', err);
      setUploadingFileIndex(null);
      throw err;
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!blogTitle.trim()) {
      toast.error('Please enter a blog title');
      return;
    }
    if (!blogBody.trim()) {
      toast.error('Please enter blog content');
      return;
    }

    setIsSubmitting(true);
    const toastId = 'blog-creation';

    try {
      const fileData = await processFileUploads(toastId);

      const updatedPayload: BlogAPI.CreateBlogRequest = {
        blogTitle: blogTitle.trim(),
        blogBody: blogBody.trim(),
        uploadedPhotos: fileData?.uploadedPhotos || [],
        uploadedVideos: fileData?.uploadedVideos || [],
      };

      toast.loading('Creating blog...', { id: toastId });
      await blogService.createBlog(updatedPayload);

      // Dismiss loading toast
      toast.dismiss(toastId);

      // Auto-refetch blogs for the creator
      onBlogCreated?.();

      // Show success toast
      toast.success('Blog posted successfully! 🎉', {
        position: 'bottom-right',
        duration: 3000,
      });

      // Reset form
      setBlogTitle('');
      setBlogBody('');
      setBlogPhotos(null);
      setBlogVideos(null);
      setUploadedPhotoIndexes(new Set());
      setUploadedVideoIndexes(new Set());
      if (photoInputRef.current) photoInputRef.current.value = '';
      if (videoInputRef.current) videoInputRef.current.value = '';

      // Close modal
      handleClose();
    } catch (err) {
      toast.error(getErrorMessage(err), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-all"
      >
        <Plus size={20} />
        Create Blog
      </button>
    );
  }

  return (
    <>
      {/* Backdrop with blur covering entire screen */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-[9999]"
        onClick={(e) => {
          // Only close if clicking directly on the backdrop
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[10000] overflow-y-auto pointer-events-none">
        <div className="flex min-h-full items-center justify-center p-4 pointer-events-auto">
          <div
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Share Your Story
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Create an engaging blog post with images and videos
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={24} className="text-foreground" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-8 space-y-8">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Blog Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="What's your blog about?"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  maxLength={200}
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {blogTitle.length}/200 characters
                </p>
              </div>

              {/* Body Input */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Blog Content <span className="text-destructive">*</span>
                </label>
                <textarea
                  placeholder="Share your thoughts, insights, and experiences..."
                  value={blogBody}
                  onChange={(e) => setBlogBody(e.target.value)}
                  maxLength={10000}
                  rows={6}
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent resize-none transition-all text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {blogBody.length}/10000 characters
                </p>
              </div>

              {/* Images Section */}
              <div className="border-t border-border pt-6">
                <label className="flex text-sm font-semibold text-foreground mb-4 items-center gap-2">
                  <ImageIcon size={18} className="text-primary" />
                  Add Images{' '}
                  <span className="text-xs text-muted-foreground font-normal">
                    (Max {MAX_IMAGES}, 5MB each)
                  </span>
                </label>

                <input
                  ref={photoInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => validateImages(e.target.files)}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full py-6 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <Plus
                    size={24}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  <span className="text-foreground font-medium text-sm">
                    Click to add photos
                  </span>
                  <span className="text-xs text-muted-foreground">
                    or drag and drop
                  </span>
                </button>

                {/* Image Previews */}
                {blogPhotos && blogPhotos.length > 0 && (
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {previewImages().map((src, index) => {
                      const isUploading =
                        uploadingFileIndex?.type === 'photo' &&
                        uploadingFileIndex?.index === index;
                      const isUploaded = uploadedPhotoIndexes.has(index);

                      return (
                        <div key={index} className="relative group">
                          <Image
                            src={src}
                            alt={`Preview ${index + 1}`}
                            width={112}
                            height={112}
                            className="w-full h-28 object-cover rounded-lg border border-border group-hover:border-primary transition-colors"
                          />

                          {/* Loading Overlay */}
                          {isUploading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}

                          {/* Uploaded Checkmark */}
                          {isUploaded && !isUploading && (
                            <div className="absolute inset-0 bg-green-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                              <Check size={24} className="text-green-600" />
                            </div>
                          )}

                          {/* Remove Button - Only show when not uploading */}
                          {!isUploading && (
                            <button
                              type="button"
                              onClick={() => removeImages(index)}
                              className="absolute -top-2 -right-2 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <X
                                size={12}
                                className="text-primary-foreground"
                              />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {blogPhotos && (
                  <p className="text-xs text-muted-foreground mt-3">
                    {blogPhotos.length} image(s) selected
                  </p>
                )}
              </div>

              {/* Videos Section */}
              <div className="border-t border-border pt-6">
                <label className="flex text-sm font-semibold text-foreground mb-4 items-center gap-2">
                  <Video size={18} className="text-primary" />
                  Add Videos{' '}
                  <span className="text-xs text-muted-foreground font-normal">
                    (Max {MAX_VIDEOS}, 50MB each)
                  </span>
                </label>

                <input
                  ref={videoInputRef}
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={(e) => validateVideos(e.target.files)}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full py-6 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <Plus
                    size={24}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  <span className="text-foreground font-medium text-sm">
                    Click to add videos
                  </span>
                  <span className="text-xs text-muted-foreground">
                    or drag and drop
                  </span>
                </button>

                {/* Video Previews */}
                {blogVideos && blogVideos.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {previewVideos().map((src, index) => {
                      const isUploading =
                        uploadingFileIndex?.type === 'video' &&
                        uploadingFileIndex?.index === index;
                      const isUploaded = uploadedVideoIndexes.has(index);

                      return (
                        <div key={index} className="relative group">
                          <video
                            src={src}
                            controls
                            className="w-full h-32 object-cover rounded-lg border border-border bg-muted group-hover:border-primary transition-colors"
                          />

                          {/* Loading Overlay */}
                          {isUploading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}

                          {/* Uploaded Checkmark */}
                          {isUploaded && !isUploading && (
                            <div className="absolute inset-0 bg-green-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                              <Check size={24} className="text-green-600" />
                            </div>
                          )}

                          {/* Remove Button - Only show when not uploading */}
                          {!isUploading && (
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="absolute -top-2 -right-2 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <X
                                size={12}
                                className="text-primary-foreground"
                              />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {blogVideos && (
                  <p className="text-xs text-muted-foreground mt-3">
                    {blogVideos.length} video(s) selected
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="border-t border-border pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 px-6 bg-muted text-foreground font-medium rounded-lg hover:opacity-80 disabled:opacity-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting || !blogTitle.trim() || !blogBody.trim()
                  }
                  className="flex-1 py-2.5 px-6 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Blog'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBlog;
