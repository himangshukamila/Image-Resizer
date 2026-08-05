import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  variant?: 'neutral' | 'green' | 'blue' | 'amber' | 'rose';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className,
}) => {
  const variantStyles = {
    neutral:
      'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
    green:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    blue:
      'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    amber:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    rose:
      'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 font-mono',
    md: 'text-xs px-2 py-0.5 font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-md border tracking-tight select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
