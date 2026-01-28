import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
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
  } = useChatStore();

  const [input, setInput] = useState('');

  // 1. Fetch messages for the specific conversation
  useEffect(() => {
    if (userId) getConversationMessages(userId);
  }, [userId, getConversationMessages]);

  // 2. Fetch users fallback (FIXED)
  // We removed 'users.length' from dependency array to prevent infinite loop
  useEffect(() => {
    if (!isUsersLoading && users.length === 0) {
      getUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUsers]);

  // 3. Identify Partner
  const conversationUser: User | undefined =
    selectedUser || users.find((u) => u._id === userId);

  // 4. Send Handler
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ text: input }, userId);
    setInput('');
  };

  return {
    messages,
    conversationUser,
    isMessagesLoading,
    isUsersLoading,
    users,
    input,
    setInput,
    handleSend,
    isSendingMessage,
  };
};
