import * as React from 'react'
import { cn } from '@/lib/utils'

export type StatusType =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'pending'
  | 'processing'

const statusConfig: Record<StatusType, { label: string; className: string }> =
  {
    success: { label: 'Success', className: 'bg-success/10 text-success' },
    warning: { label: 'Warning', className: 'bg-warning/10 text-warning' },
    danger: { label: 'Danger', className: 'bg-danger/10 text-danger' },
    info: { label: 'Info', className: 'bg-info/10 text-info' },
    neutral: { label: 'Neutral', className: 'bg-muted text-text-secondary' },
    pending: { label: 'Pending', className: 'bg-warning/10 text-warning' },
    processing: { label: 'Processing', className: 'bg-info/10 text-info' },
  }

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType
  label?: string
}

function StatusBadge({
  status,
  label,
  className,
  ...props
}: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
      {...props}
    >
      {label ?? config.label}
    </span>
  )
}

export { StatusBadge, statusConfig }
