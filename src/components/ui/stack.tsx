import * as React from 'react'
import { cn } from '@/lib/utils'

export interface StackProps {
  children: React.ReactNode
  className?: string
  direction?: 'horizontal' | 'vertical'
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
}

const spacingValues = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

export function Stack({
  children,
  className,
  direction = 'vertical',
  spacing = 'md',
  align,
  justify,
}: StackProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        spacingValues[spacing],
        align && {
          start: 'items-start',
          center: 'items-center',
          end: 'items-end',
          stretch: 'items-stretch',
        }[align],
        justify && {
          start: 'justify-start',
          center: 'justify-center',
          end: 'justify-end',
          between: 'justify-between',
          around: 'justify-around',
          evenly: 'justify-evenly',
        }[justify],
        className
      )}
    >
      {children}
    </div>
  )
}
