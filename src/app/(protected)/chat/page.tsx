'use client';

import DevconnectLoader from '@/components/loadingSpinner';
import { useAuthStore } from '@/store/useAuthStore';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatEmptyPage() {
  const router = useRouter();
  const { authUser, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      router.push('/login');
    }
  }, [authUser, router, isCheckingAuth]);

  if (!authUser) {
    return <DevconnectLoader />;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50/30 text-center p-4">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <MessageSquare size={48} className="text-blue-500 opacity-80" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Welcome to DevConnect Chat
      </h2>
      <p className="text-gray-500 max-w-md mb-8">
        Select a conversation from the sidebar to start messaging your
        connections.
      </p>
    </div>
  );
}
