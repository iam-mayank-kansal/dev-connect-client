'use client';

import React from 'react';

const FeedShimmer = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* LEFT SIDEBAR SKELETON */}
        <aside className="hidden md:block md:col-span-1">
          <div className="bg-card border border-border rounded-2xl overflow-hidden sticky top-20 p-5">
            {/* Avatar Skeleton */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
            </div>

            {/* Name Skeleton */}
            <div className="text-center mb-4 pb-4 border-b border-border/50">
              <div className="h-5 bg-muted animate-pulse rounded-lg mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded-lg w-3/4 mx-auto" />
            </div>

            {/* Stats Skeleton */}
            <div className="space-y-3 mb-4 pb-4 border-b border-border/50">
              <div className="h-12 bg-muted animate-pulse rounded-xl" />
              <div className="h-12 bg-muted animate-pulse rounded-xl" />
            </div>

            {/* Button Skeleton */}
            <div className="h-10 bg-muted animate-pulse rounded-xl" />
          </div>
        </aside>

        {/* CENTER FEED SKELETON */}
        <main className="md:col-span-3">
          {/* Create Post Card Skeleton */}
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 h-10 bg-muted animate-pulse rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Blog Posts Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                {/* Card Header Skeleton */}
                <div className="p-4 flex items-center gap-3 border-b border-border/40">
                  <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted animate-pulse rounded mb-2 w-1/2" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                  </div>
                </div>

                {/* Card Body Skeleton */}
                <div className="p-4 border-b border-border/40">
                  <div className="h-5 bg-muted animate-pulse rounded mb-3 w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </div>

                {/* Media Skeleton */}
                <div className="h-64 bg-muted animate-pulse border-t border-border/40" />

                {/* Footer Skeleton */}
                <div className="p-4 border-t border-border/40">
                  <div className="flex gap-4">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="flex-1 h-8 bg-muted animate-pulse rounded"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeedShimmer;
