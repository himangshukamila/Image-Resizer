import React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefixText?: string;
  suffixText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefixText, suffixText, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-100 focus-within:border-transparent transition-all">
          {prefixText && (
            <span className="px-3 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700 select-none py-2">
              {prefixText}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            className={clsx(
              'w-full px-3 py-1.5 text-sm bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-mono',
              className
            )}
            {...props}
          />
          {suffixText && (
            <span className="px-3 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border-l border-zinc-300 dark:border-zinc-700 select-none py-2">
              {suffixText}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
