import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export interface StatCardProps {
  title: string
  value: string | number
  change?: string
  description?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  /** Accepts a rendered node or an icon component (e.g. a Lucide icon). */
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>
  loading?: boolean
  isLoading?: boolean
  className?: string
}

/**
 * StatCard — Sovereign Ledger metric treatment.
 *
 * Quiet surface, hairline border, uppercase micro-label, tabular-figure value.
 * Consumed across dashboards; the props API is stable — do not change it.
 */
export function StatCard({
  title,
  value,
  change,
  description,
  changeType = 'neutral',
  icon,
  loading = false,
  isLoading = false,
  className,
}: StatCardProps) {
  const isBusy = loading || isLoading
  const detail = change ?? description
  const changeColor = {
    increase: 'text-success',
    decrease: 'text-danger',
    neutral: 'text-text-secondary',
  } as const

  return (
    <Card className={cn('hover-raise min-h-[124px]', className)}>
      <CardContent className="flex h-full flex-col justify-between gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-tertiary">
            {title}
          </p>
          {icon ? (
            <span
              aria-hidden="true"
              className="rounded-xl border border-border bg-surface-elevated p-2 text-text-secondary"
            >
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
            </span>
          ) : null}
        </div>
        {isBusy ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-28" />
            {detail ? <Skeleton className="h-4 w-20" /> : null}
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-numeric text-2xl font-semibold tracking-[-0.03em] text-text-primary">
              {value}
            </p>
            {detail ? (
              <p className={cn('text-[13px] leading-5', changeColor[changeType])}>{detail}</p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}