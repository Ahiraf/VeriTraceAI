import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'finding' | 'success' | 'escalated' | 'draft' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const baseStyles = 'inline-flex items-center text-xs px-2 py-0.5 rounded-xs font-medium border';

  const variants = {
    default: 'bg-surface text-muted-foreground border-border',
    finding: 'bg-finding-bg text-finding-indicator border-finding-indicator/30',
    success: 'bg-success-bg text-success border-success/30',
    escalated: 'bg-escalated-bg text-escalated border-escalated/30',
    draft: 'bg-surface-raised text-muted-foreground border-border tracking-wider font-mono text-[10px] uppercase',
    outline: 'bg-transparent text-muted-foreground border-border',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </span>
  );
};
