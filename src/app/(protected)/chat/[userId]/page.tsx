'use client';

import { use } from 'react';
import Link from 'next/link';
import MessageSkeleton from '@/components/skeletons/MessageSkeleton';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import { useChatConversation } from '@/hooks/useChatConversation';

interface ChatConversationProps {
  params: Promise<{ userId: string }>;
}

export default function ChatConversation({ params }: ChatConversationProps) {
  const { userId } = use(params);

  const {
    messages,
    conversationUser,
    isMessagesLoading,
    isUsersLoading,
    users,
    input,
    setInput,
    handleSend,
    isSendingMessage,
  } = useChatConversation(userId);

  // 1. Initial Load Skeleton (Waiting for user details)
  if (!conversationUser && isUsersLoading) {
    return <MessageSkeleton />;
  }

  // 2. User Not Found
  if (!conversationUser && !isUsersLoading && users.length > 0) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4 bg-gray-50 text-gray-500">
        <p>User not found.</p>
        <Link href="/chat" className="text-blue-600 hover:underline">
          Back to messages
        </Link>
      </div>
    );
  }

  // 3. Safety Fallback
  if (!conversationUser) return <MessageSkeleton />;

  // 4. Main Render
  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      <ChatHeader user={conversationUser} />

      <MessageList
        messages={messages}
        isLoading={isMessagesLoading}
        partnerId={userId}
        partnerName={conversationUser.name}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        disabled={isMessagesLoading || isSendingMessage}
      />
    </div>
  );
}
