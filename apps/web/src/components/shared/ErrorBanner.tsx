import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry, className }) => {
  return (
    <div
      role="alert"
      className={twMerge(
        clsx(
          'flex items-center justify-between px-4 py-2.5 rounded-xs border border-escalated/30 bg-escalated-bg text-escalated text-xs',
          className
        )
      )}
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="font-bold">▲</span>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="font-medium underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
        >
          Retry
        </button>
      )}
    </div>
  );
};
