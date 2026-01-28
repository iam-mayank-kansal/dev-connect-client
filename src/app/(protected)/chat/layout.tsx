'use client';

import { useState } from 'react';
import ChatSidebar from '@/components/chat-layout/ChatSidebar';
import NewChatModal from '@/components/chat-layout/NewChatModal';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to track if modal is visible
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden relative">
      {/* 1. We pass the function to OPEN the modal to the Sidebar */}
      <ChatSidebar onOpenModal={() => setIsModalOpen(true)} />

      {/* 2. If state is true, we render the modal */}
      {isModalOpen && <NewChatModal onClose={() => setIsModalOpen(false)} />}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white">{children}</main>
    </div>
  );
}
