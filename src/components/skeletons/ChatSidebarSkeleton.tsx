'use client';

export default function ChatSidebarSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Skeleton Header */}
      <div className="p-4 border-b border-gray-100 shrink-0">
        <div className="flex justify-between items-center mb-4">
          {/* Title Placeholder */}
          <div className="h-8 w-32 bg-gray-200 rounded-lg" />
          {/* "New Chat" Button Placeholder */}
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>

        {/* Search Bar Placeholder */}
        <div className="h-10 w-full bg-gray-200 rounded-xl" />
      </div>

      {/* Skeleton List Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
            {/* Avatar Circle */}
            <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />

            {/* Text Lines */}
            <div className="flex-1 space-y-2">
              {/* Name Line */}
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              {/* Role/Subtitle Line */}
              <div className="h-3 w-1/3 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
