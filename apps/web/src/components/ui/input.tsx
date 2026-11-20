import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(
          clsx(
            'flex h-9 w-full rounded-xs border border-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-escalated focus-visible:outline-escalated',
            className
          )
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
