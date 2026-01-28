export interface User {
  _id: string;
  name: string;
  profilePicture?: string;
  designation?: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  isRead: boolean;
  readAt: Date | null;
}

export interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;

  getUsers: () => Promise<void>;
  getConversationMessages: (userId: string) => Promise<void>;
  sendMessage: (
    messageData: { text: string; image?: string },
    receiverId: string
  ) => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;
}
