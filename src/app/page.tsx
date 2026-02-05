'use client';
import ProfileSidebar from '@/components/feed/ProfileSidebar';
import CreatePostSection from '@/components/feed/CreatePostSection';
import { AuthenticatedFeed } from '@/components/feed/AuthenticatedFeed';
import FeedShimmer from '@/components/skeletons/FeedShimmer';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';
import { useBlogFeed } from '@/hooks/useBlogFeed';
import { useUserStore } from '@/store/useUserStore';
import { isValidImageUrl } from '@/lib/utils/media';
import UnauthenticatedView from '@/components/feed/UnauthenticatedView';
import { useAuthStore } from '@/store/useAuthStore';

function Home() {
  const { isAuthChecking, authUser } = useAuthInitialization();
  const { onlineUsers } = useAuthStore();
  const { profileUser } = useUserStore();
  const blogFeed = useBlogFeed(authUser?._id);

  if (isAuthChecking) {
    return <FeedShimmer />;
  }

  if (!authUser?._id) {
    return <UnauthenticatedView />;
  }

  console.log('Online Users in Home Page:', onlineUsers);

  return (
    <div className="min-h-screen bg-muted/30 text-foreground font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Sidebar */}
        <ProfileSidebar
          profileUser={profileUser}
          authUser={authUser}
          isValidImageUrl={isValidImageUrl}
        />

        {/* Feed Area */}
        <div className="md:col-span-3">
          {/* Create Post Section */}
          <CreatePostSection
            profileUser={profileUser}
            onCreateClick={() => blogFeed.setShowCreateBlog(true)}
            isValidImageUrl={isValidImageUrl}
          />

          {/* Authenticated Feed */}
          <AuthenticatedFeed
            blogs={blogFeed.blogs}
            loading={blogFeed.loading}
            error={blogFeed.error}
            hasNewBlogs={blogFeed.hasNewBlogs}
            newBlogCount={blogFeed.newBlogCount}
            isRefetching={blogFeed.isRefetching}
            refetchBlogs={blogFeed.refetchBlogs}
            showCreateBlog={blogFeed.showCreateBlog}
            setShowCreateBlog={blogFeed.setShowCreateBlog}
            isLoadingMore={blogFeed.isLoadingMore}
            observerTarget={
              blogFeed.observerTarget as React.RefObject<HTMLDivElement>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
