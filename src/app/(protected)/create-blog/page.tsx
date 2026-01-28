'use client';
// Reverting to aliased paths as relative paths also failed.
import CreateBlog from '@/components/blog/create-blog';
import DevconnectLoader from '@/components/loadingSpinner';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Renamed from 'createBlog' to 'CreateBlogPage' to fix React Hook error
function CreateBlogPage() {
  const router = useRouter();
  const { authUser, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    // Check only after user loading is complete
    if (!isCheckingAuth && !authUser) {
      router.push('/login');
    }
    // Added isCheckingAuth and router as dependencies to fix exhaustive-deps warning
  }, [authUser, isCheckingAuth, router]);

  // Show loader while user is loading
  if (isCheckingAuth) {
    return <DevconnectLoader />;
  }

  // If user exists, show the create blog component.
  // If user doesn't exist, the useEffect will trigger a redirect,
  // so showing a loader or null here prevents a flash of content.
  return <>{authUser ? <CreateBlog /> : <DevconnectLoader />}</>;
}

// Update the export to match the new component name
export default CreateBlogPage;
