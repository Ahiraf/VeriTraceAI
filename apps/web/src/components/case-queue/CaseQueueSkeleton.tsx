import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const CaseQueueSkeleton: React.FC = () => {
  return (
    <div className="w-full border border-border rounded-sm bg-surface overflow-hidden">
      <div className="border-b border-border bg-surface-raised px-4 py-2.5 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5 w-1/4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
};
