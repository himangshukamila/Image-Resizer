import React from 'react';
import { clsx } from 'clsx';

export interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
  marks?: { value: number; label: string }[];
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  className,
  disabled = false,
  marks,
}) => {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  return (
    <div className={clsx('flex flex-col gap-2 w-full', className)}>
      {(label || value !== undefined) && (
        <div className="flex justify-between items-center text-xs">
          {label && (
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              {label}
            </label>
          )}
          <span className="font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
            {value}
            {unit}
          </span>
        </div>
      )}

      <div className="relative flex items-center w-full">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label || 'Slider'}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer focus:outline-none accent-zinc-900 dark:accent-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {marks && marks.length > 0 && (
        <div className="flex justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-mono px-0.5">
          {marks.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => onChange(m.value)}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
