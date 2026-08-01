'use client'

import { ReactNode } from 'react'
import { ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface ChartContainerProps {
  /** Chart height in pixels. */
  height?: number
  /** When true, shows a skeleton placeholder instead of the chart. */
  isLoading?: boolean
  className?: string
  children: ReactNode
}

/**
 * Standard responsive wrapper for all Recharts visualizations.
 * Enforces consistent sizing and a skeleton loading state across the app.
 */
export function ChartContainer({
  height = 300,
  isLoading = false,
  className,
  children,
}: ChartContainerProps) {
  if (isLoading) {
    return <Skeleton className={cn('w-full', className)} style={{ height }} />
  }

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  )
}
