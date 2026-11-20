import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CaseStatus } from '@veritrace/types';

interface StatusBadgeProps {
  status: CaseStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  // Normalize status string to handle both API and internal enums
  const normalized = status.toLowerCase();

  if (normalized.includes('cleared')) {
    return (
      <span
        className={twMerge(
          clsx(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-xs font-medium border bg-success-bg text-success border-success/30',
            className
          )
        )}
      >
        <span aria-hidden="true" className="text-[11px] leading-none">✓</span>
        <span>Cleared</span>
      </span>
    );
  }

  if (normalized.includes('escalat')) {
    return (
      <span
        className={twMerge(
          clsx(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-xs font-medium border bg-escalated-bg text-escalated border-escalated/30',
            className
          )
        )}
      >
        <span aria-hidden="true" className="text-[10px] leading-none">▲</span>
        <span>Escalated</span>
      </span>
    );
  }

  if (normalized.includes('evidence') || normalized.includes('request')) {
    return (
      <span
        className={twMerge(
          clsx(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-xs font-medium border bg-surface text-primary border-primary/30',
            className
          )
        )}
      >
        <span aria-hidden="true" className="text-[11px] leading-none">◉</span>
        <span>Evidence Requested</span>
      </span>
    );
  }

  if (normalized.includes('review') || normalized.includes('analyst') || normalized.includes('finding')) {
    return (
      <span
        className={twMerge(
          clsx(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-xs font-medium border bg-finding-bg text-finding-indicator border-finding-indicator/30',
            className
          )
        )}
      >
        <span aria-hidden="true" className="text-[11px] leading-none">⚑</span>
        <span>Under Review</span>
      </span>
    );
  }

  // Intake or extracting/resolving default
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-xs font-medium border bg-surface text-muted-foreground border-border',
          className
        )
      )}
    >
      <span aria-hidden="true" className="text-[10px] leading-none">○</span>
      <span>{status}</span>
    </span>
  );
};
