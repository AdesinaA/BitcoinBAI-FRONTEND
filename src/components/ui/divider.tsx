import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DividerProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

export function Divider({
  className,
  orientation = 'horizontal',
  label,
}: DividerProps) {
  if (label) {
    return (
      <div
        className={cn(
          'relative flex items-center',
          orientation === 'horizontal' ? 'my-4' : 'mx-2',
          className
        )}
      >
        <div
          className={cn(
            'absolute border-border',
            orientation === 'horizontal'
              ? 'h-px w-full'
              : 'h-full w-px'
          )}
        />
        <span
          className={cn(
            'bg-surface px-2 text-xs text-text-tertiary',
            orientation === 'horizontal' ? 'mx-2' : 'my-2'
          )}
        >
          {label}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal'
          ? 'h-px w-full'
          : 'h-full w-px',
        className
      )}
      aria-orientation={orientation}
    />
  )
}
