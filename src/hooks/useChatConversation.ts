import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useUserStore } from '@/store/useUserStore';
import { User } from '@/lib/types/chat';

export const useChatConversation = (userId: string) => {
  const {
    messages,
    users,
    selectedUser,
    getConversationMessages,
    getUsers,
    isMessagesLoading,
    isUsersLoading,
    sendMessage,
    isSendingMessage,
    subscribeToNewMessages,
    unSubscribeFromNewMessages,
    setSelectedUser,
  } = useChatStore();

  const { profileUser, isLoadingProfile, fetchUserProfile } = useUserStore();

  const [input, setInput] = useState('');

  // 1. Fetch messages for the specific conversation
  useEffect(() => {
    if (userId) getConversationMessages(userId);

    subscribeToNewMessages();

    return () => {
      unSubscribeFromNewMessages();
    };
  }, [
    userId,
    getConversationMessages,
    subscribeToNewMessages,
    unSubscribeFromNewMessages,
  ]);

  // 2. Fetch user profile if not in users list
  useEffect(() => {
    const userExists = users.find((u) => u._id === userId);
    if (!userExists && !selectedUser && userId) {
      fetchUserProfile(userId);
    }
  }, [userId, users, selectedUser, fetchUserProfile]);

  // 3. Set selectedUser from profileUser when available
  useEffect(() => {
    if (profileUser && profileUser._id === userId && !selectedUser) {
      setSelectedUser({
        _id: profileUser._id,
        name: profileUser.name,
        profilePicture: profileUser.profilePicture || '',
      } as User);
    }
  }, [profileUser, userId, selectedUser, setSelectedUser]);

  // 4. Fetch users fallback
  useEffect(() => {
    if (!isUsersLoading && users.length === 0) {
      getUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUsers]);

  // 5. Identify Partner
  const conversationUser: User | undefined =
    selectedUser || users.find((u) => u._id === userId);

  // 6. Send Handler
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ text: input }, userId);
    setInput('');
  };

  return {
    messages,
    conversationUser,
    isMessagesLoading: isMessagesLoading || isLoadingProfile,
    isUsersLoading,
    users,
    input,
    setInput,
    handleSend,
    isSendingMessage,
  };
};
