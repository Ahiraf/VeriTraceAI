import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const DocumentViewerSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col flex-1 bg-background">
      {/* Top bar skeleton */}
      <div className="border-b border-border bg-surface px-4 py-2 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Main split viewer */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left canvas placeholder */}
        <div className="flex-1 p-8 flex items-center justify-center bg-muted/20">
          <Skeleton className="w-[480px] h-[640px] rounded-xs shadow" />
        </div>

        {/* Right fields list */}
        <div className="w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l border-border bg-surface p-4 flex flex-col gap-3">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
};
