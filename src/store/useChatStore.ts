import axios from 'axios';
import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstanace } from '@/lib/api/client';
import { Message, User } from '@/lib/types/chat';
import { useAuthStore } from './useAuthStore';

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
  subscribeToNewMessages: () => void;
  unSubscribeFromNewMessages: () => void;
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

      // Add user to the users list if not already there (for sidebar)
      const currentUsers = get().users;
      const selectedUser = get().selectedUser;
      const userExists = currentUsers.find((u) => u._id === receiverId);

      if (!userExists && selectedUser && selectedUser._id === receiverId) {
        set({ users: [...currentUsers, selectedUser] });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Error sending message');
      }
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToNewMessages: () => {
    if (!get().selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on('newMessage', (newMessage: Message) => {
      const selectedUser = get().selectedUser;
      // Only add message if it's from/to the selected user
      if (
        newMessage.senderId === selectedUser?._id ||
        newMessage.receiverId === selectedUser?._id
      ) {
        set({ messages: [...get().messages, newMessage] });
      }
    });
  },

  unSubscribeFromNewMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off('newMessage');
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
