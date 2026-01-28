import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from 'axios';
import { axiosInstanace } from '@/lib/axios';
import { Message, User } from '@/lib/types/chat';

interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;

  getUsers: () => Promise<void>;
  getConversationMessages: (otherUserId: string) => Promise<void>;
  sendMessage: (
    data: { text: string; image?: string },
    receiverId: string
  ) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  getUsers: async () => {
    if (get().isUsersLoading) return;

    set({ isUsersLoading: true });
    try {
      const res = await axiosInstanace.get('/message/chats');
      set({ users: res.data.data.users });
    } catch (err: unknown) {
      console.error('Error fetching users:', err);
      // Suppress toast on 401 to avoid spamming user if not logged in
      if (axios.isAxiosError(err) && err.response?.status !== 401) {
        toast.error(err.response?.data?.message || 'Error fetching users');
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getConversationMessages: async (otherUserId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstanace.get(
        `/message/conversation/${otherUserId}`
      );
      set({ messages: res.data.data });
    } catch (err: unknown) {
      console.error('Error fetching messages:', err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Error fetching messages');
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData, receiverId) => {
    set({ isSendingMessage: true });
    try {
      const res = await axiosInstanace.post(
        `/message/send-message/${receiverId}`,
        messageData
      );
      // Optimistically update UI
      set({ messages: [...get().messages, res.data.data] });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Error sending message');
      }
    } finally {
      set({ isSendingMessage: false });
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
