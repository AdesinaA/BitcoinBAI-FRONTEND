import * as React from 'react'
import { cn } from '@/lib/utils'
import { format, formatDistanceToNow } from 'date-fns'

export interface DateDisplayProps {
  date: Date | string | number
  formatStr?: string
  relative?: boolean
  className?: string
}

export function DateDisplay({
  date,
  formatStr = 'PPp',
  relative = false,
  className,
}: DateDisplayProps) {
  const dateObj = new Date(date)

  const display = relative
    ? formatDistanceToNow(dateObj, { addSuffix: true })
    : format(dateObj, formatStr)

  return (
    <time
      className={cn('text-sm text-text-secondary', className)}
      dateTime={dateObj.toISOString()}
    >
      {display}
    </time>
  )
}
