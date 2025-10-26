'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ApiUser, ConnectionData } from '@/lib/types/connection';

export const useConnections = () => {
  const [connectionData, setConnectionData] = useState<ConnectionData>({
    connected: [],
    blocked: [],
    requestReceived: [],
    requestSent: [],
    ignored: [],
  });

  const [suggestedUsers, setSuggestedUsers] = useState<ApiUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSuggested, setIsLoadingSuggested] = useState(false);

  const fetchConnectionData = async () => {
    // No setIsLoading here to allow background refresh without a full loader
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect/userconnection/get-user-connections`,
        { withCredentials: true }
      );

      const dataFromApi = response.data.data;
      setConnectionData({
        connected: dataFromApi.connected || [],
        blocked: dataFromApi.blocked || [],
        requestReceived: dataFromApi.requestReceived || [],
        requestSent: dataFromApi.requestSent || [],
        ignored: dataFromApi.ignored || [],
      });
    } catch (error) {
      console.error('Failed to fetch connection data:', error);
    }
  };

  const fetchSuggestedConnections = async () => {
    setIsLoadingSuggested(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect/userconnection/find-connection`,
        { withCredentials: true }
      );
      setSuggestedUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch suggested connections:', error);
      setSuggestedUsers([]);
    } finally {
      setIsLoadingSuggested(false);
    }
  };

  // A helper to refetch everything concurrently
  const refetchAll = async () => {
    await Promise.all([fetchConnectionData(), fetchSuggestedConnections()]);
  };

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      await Promise.all([fetchConnectionData(), fetchSuggestedConnections()]);
      setIsLoading(false);
    };
    initialFetch();
  }, []);

  const handleConnect = async (userId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect/userconnection/send-connection-request`,
        { toUserId: userId },
        { withCredentials: true }
      );
      console.log('Connection request sent to:', userId);
      await refetchAll(); // Refetch everything
    } catch (error) {
      console.error('Failed to send connection request:', error);
    }
  };

  const handleIgnoreAndUnignore = async (
    userId: string,
    action: 'ignore' | 'unignore'
  ) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect/userconnection/ignore-unignore-connection-request`,
        { toUserId: userId, status: action },
        { withCredentials: true }
      );
      console.log(`User ${action}d:`, userId);
      await refetchAll(); // Refetch everything
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const suspendSentRequest = async (userId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect/userconnection/suspend-sent-connection-request`,
        { toUserId: userId },
        { withCredentials: true }
      );
      console.log('Connection request suspended for:', userId);
      await refetchAll(); // Refetch everything
    } catch (error) {
      console.error('Failed to suspend connection request:', error);
    }
  };

  const deleteConnection = async (userId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect/userconnection/delete-connection`,
        { toUserId: userId },
        { withCredentials: true }
      );
      console.log('Connection deleted for:', userId);
      await refetchAll(); // Refetch everything
    } catch (error) {
      console.error('Failed to delete connection:', error);
    }
  };

  const connectionResponse = async (
    userId: string,
    action: 'accept' | 'reject'
  ) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect/userconnection/connection-response`,
        {
          fromUserId: userId,
          status: action + 'ed',
        },
        { withCredentials: true }
      );
      console.log(`Connection request ${action}ed for:`, userId);
      await refetchAll(); // Refetch everything
    } catch (error) {
      console.error(`Failed to ${action} connection request:`, error);
    }
  };

  const handleBlockAndUnblock = async (
    userId: string,
    action: 'block' | 'unblock'
  ) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect/userconnection/block-unblock-connection-request`,
        { toUserId: userId, status: action },
        { withCredentials: true }
      );
      console.log(`User ${action}ed:`, userId);
      await refetchAll(); // Refetch everything
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  return {
    connectionData,
    suggestedUsers,
    isLoading,
    isLoadingSuggested,
    handleConnect,
    suspendSentRequest,
    handleIgnoreAndUnignore,
    handleBlockAndUnblock,
    connectionResponse,
    deleteConnection,
  };
};
export default useConnections;
