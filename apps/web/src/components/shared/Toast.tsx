'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ToastProps {
  id: string;
  message: string;
  variant?: 'info' | 'success' | 'escalated';
  onDismiss: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  variant = 'info',
  onDismiss,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, onDismiss, duration]);

  const variantStyles = {
    info: 'border-border bg-surface-raised text-foreground',
    success: 'border-success/40 bg-surface-raised text-success',
    escalated: 'border-escalated/40 bg-surface-raised text-escalated',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={twMerge(
        clsx(
          'flex items-center justify-between gap-3 px-4 py-3 rounded-lg border shadow-lg text-xs transition-all duration-200',
          variantStyles[variant]
        )
      )}
    >
      <span className="font-medium">{message}</span>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="text-muted-foreground hover:text-foreground p-1 -mr-1"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
};
