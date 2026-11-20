import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const CaseDetailSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="border-b border-border bg-surface px-4 py-4 lg:px-6 flex items-center justify-between">
        <div className="flex flex-col gap-2 w-1/3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Main split view skeleton */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left rail skeleton */}
        <div className="w-full lg:w-[280px] border-b lg:border-b-0 lg:border-r border-border bg-surface p-4 flex flex-col gap-3">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>

        {/* Right comparison panel skeleton */}
        <div className="flex-1 p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>

          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  );
};
