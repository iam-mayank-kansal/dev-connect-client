import { useState, useEffect, useCallback } from 'react';
import { User } from '@/lib/types/entities'; // Ensure this matches your project path
import { userConnectionService } from '@/services/connections/connectionService';

export const useFindConnections = () => {
  // Local State for the list
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10; // You can make this dynamic if needed

  // Core Fetch Function
  const fetchUsers = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      // Call the service (which returns { users: User[], pagination: {...} })
      const responseData = await userConnectionService.findConnections(
        pageNum,
        LIMIT
      );

      const newUsers = responseData.users;
      const pagination = responseData.pagination;

      // Update 'hasMore' based on backend response
      setHasMore(pagination.hasMore);

      // If page 1, replace data. If page > 1, append data.
      setUsers((prev) => (pageNum === 1 ? newUsers : [...prev, ...newUsers]));
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to load suggestions';
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Fetch on Mount
  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  // Handler for "Load More" button
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(nextPage);
    }
  };

  // Handler to Refresh the list (e.g., Pull to Refresh)
  const refetch = () => {
    setPage(1);
    setHasMore(true);
    fetchUsers(1);
  };

  // Optimistic Update Helper
  // Call this after successfully sending a connection request to remove the card instantly
  const removeUserFromList = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  }, []);

  return {
    users,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    removeUserFromList,
  };
};
