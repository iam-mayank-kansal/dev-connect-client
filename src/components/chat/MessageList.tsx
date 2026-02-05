'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/lib/types/chat';
import { formatDate } from '@/lib/utils/dateFormatter';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  partnerId: string;
  partnerName: string;
}

export default function MessageList({
  messages,
  isLoading,
  partnerId,
  partnerName,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  if (isLoading) {
    return (
      <div className="flex-1 px-4 md:px-6 py-4 space-y-4 bg-gray-50/50 custom-scrollbar animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`h-10 w-48 rounded-2xl ${i % 2 === 0 ? 'bg-blue-100' : 'bg-gray-200'}`}
            />
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 text-gray-400 text-sm">
        <p>No messages yet.</p>
        <p>Say hello to {partnerName}!</p>
      </div>
    );
  }

  // Message List
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 bg-gray-50/50 custom-scrollbar">
      {messages.map((msg) => {
        const isMe = msg.senderId !== partnerId;

        return (
          <div
            key={msg._id}
            className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in-95 duration-200`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm break-words ${
                isMe
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`text-[10px] block mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}
              >
                {formatDate(msg.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
