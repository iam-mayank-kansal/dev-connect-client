import { RefObject } from 'react';
import CreateBlog from '@/components/blog/create-blog';
import NewBlogsNotification from '@/components/feed/NewBlogsNotification';
import FeedContent from '@/components/feed/FeedContent';
import { Blog } from '@/lib/types/blog';

interface AuthenticatedFeedProps {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  hasNewBlogs: boolean;
  newBlogCount: number;
  isRefetching: boolean;
  refetchBlogs: () => Promise<void>;
  showCreateBlog: boolean;
  setShowCreateBlog: (show: boolean) => void;
  isLoadingMore: boolean;
  observerTarget: RefObject<HTMLDivElement>;
}

export function AuthenticatedFeed({
  blogs,
  loading,
  error,
  hasNewBlogs,
  newBlogCount,
  isRefetching,
  refetchBlogs,
  showCreateBlog,
  setShowCreateBlog,
  isLoadingMore,
  observerTarget,
}: AuthenticatedFeedProps) {
  return (
    <>
      <main className="md:col-span-3">
        {hasNewBlogs && (
          <NewBlogsNotification
            newBlogCount={newBlogCount}
            isRefetching={isRefetching}
            onViewLatest={refetchBlogs}
          />
        )}

        <FeedContent
          blogs={blogs}
          loading={loading}
          error={error}
          isLoadingMore={isLoadingMore}
          observerTarget={observerTarget}
        />
      </main>

      {/* Create Blog Modal */}
      {showCreateBlog && (
        <CreateBlog
          isOpen={showCreateBlog}
          onClose={() => setShowCreateBlog(false)}
          onBlogCreated={refetchBlogs}
        />
      )}
    </>
  );
}
