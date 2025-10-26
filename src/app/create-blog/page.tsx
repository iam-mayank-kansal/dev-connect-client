'use client';
// Reverting to aliased paths as relative paths also failed.
import CreateBlog from '@/components/blog/create-blog';
import DevconnectLoader from '@/components/loadingSpinner';
import { useUser } from '@/utils/context/user-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Renamed from 'createBlog' to 'CreateBlogPage' to fix React Hook error
function CreateBlogPage() {
  const router = useRouter();
  const { user, isLoading: userIsLoading } = useUser();

  useEffect(() => {
    // Check only after user loading is complete
    if (!userIsLoading && !user) {
      router.push('/login');
    }
    // Added userIsLoading and router as dependencies to fix exhaustive-deps warning
  }, [user, userIsLoading, router]);

  // Show loader while user is loading
  if (userIsLoading) {
    return <DevconnectLoader />;
  }

  // If user exists, show the create blog component.
  // If user doesn't exist, the useEffect will trigger a redirect,
  // so showing a loader or null here prevents a flash of content.
  return <>{user ? <CreateBlog /> : <DevconnectLoader />}</>;
}

// Update the export to match the new component name
export default CreateBlogPage;
