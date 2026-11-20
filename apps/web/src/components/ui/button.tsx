import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'success' | 'escalated';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100';

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs rounded-xs gap-1.5 min-h-[32px]',
      md: 'h-9 px-4 text-sm rounded-md gap-2 min-h-[36px]',
      lg: 'h-11 px-5 text-base rounded-md gap-2.5 min-h-[44px]',
    };

    const variantStyles = {
      primary: 'bg-primary text-primary-foreground hover:bg-opacity-90',
      outline: 'border border-border bg-surface text-foreground hover:bg-surface-raised',
      ghost: 'text-foreground hover:bg-surface-raised',
      success: 'border border-success/40 bg-success-bg text-success hover:bg-success/15',
      escalated: 'border border-escalated/40 bg-escalated-bg text-escalated hover:bg-escalated/15',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-3.5 w-3.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
