'use client';

export default function MessageSkeleton() {
  return (
    <div className="flex-1 flex flex-col h-full animate-pulse bg-white">
      {/* Header Skeleton */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 md:px-6 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" /> {/* Avatar */}
          <div className="h-4 w-32 bg-gray-200 rounded" /> {/* Name */}
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
        </div>
      </header>

      {/* Messages Area Skeleton */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 space-y-6 py-4 bg-gray-50/50">
        {/* Receiver Bubble (Left) */}
        <div className="flex justify-start">
          <div className="h-10 w-48 bg-gray-200 rounded-2xl rounded-tl-none" />
        </div>

        {/* Sender Bubble (Right) */}
        <div className="flex justify-end">
          <div className="h-16 w-64 bg-blue-100 rounded-2xl rounded-tr-none opacity-50" />
        </div>

        {/* Receiver Bubble (Left) */}
        <div className="flex justify-start">
          <div className="h-10 w-32 bg-gray-200 rounded-2xl rounded-tl-none" />
        </div>

        {/* Sender Bubble (Right) */}
        <div className="flex justify-end">
          <div className="h-10 w-40 bg-blue-100 rounded-2xl rounded-tr-none opacity-50" />
        </div>
      </div>

      {/* Input Skeleton */}
      <footer className="p-4 md:px-6 bg-white border-t border-gray-200 shrink-0">
        <div className="flex items-end gap-2 mx-auto">
          <div className="flex-1 h-10 bg-gray-100 rounded-2xl" />
          <div className="w-10 h-10 bg-blue-100 rounded-full" />
        </div>
      </footer>
    </div>
  );
}
