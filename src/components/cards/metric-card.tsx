import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>
  loading?: boolean
  className?: string
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  loading = false,
  className,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        'flex items-center gap-4 p-4 transition-shadow hover:shadow-soft',
        className
      )}
    >
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated">
          {React.isValidElement(icon)
            ? icon
            : typeof icon === 'function' ||
              (typeof icon === 'object' &&
                icon !== null &&
                '$$typeof' in icon)
              ? React.createElement(
                  icon as React.ComponentType<{ className?: string }>,
                  { className: 'h-4 w-4' }
                )
              : icon}
        </div>
      )}
      <CardContent className="flex-1 p-0">
        <p className="text-sm text-text-secondary">{title}</p>
        {loading ? (
          <Skeleton className="h-6 w-20 mt-1" />
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-text-primary">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-text-secondary">{unit}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
