import * as React from 'react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/status-badge'

export type TransactionStatusType =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface TransactionStatusProps {
  status: TransactionStatusType
  showIcon?: boolean
  className?: string
}

const statusConfig: Record<
  TransactionStatusType,
  { label: string; status: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending' | 'processing' }
> = {
  pending: { label: 'Pending', status: 'pending' },
  processing: { label: 'Processing', status: 'processing' },
  completed: { label: 'Completed', status: 'success' },
  failed: { label: 'Failed', status: 'danger' },
  cancelled: { label: 'Cancelled', status: 'neutral' },
}

export function TransactionStatus({
  status,
  showIcon = true,
  className,
}: TransactionStatusProps) {
  const config = statusConfig[status]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showIcon && (
        <div
          className={cn(
            'h-2 w-2 rounded-full',
            status === 'completed' && 'bg-success',
            status === 'pending' && 'bg-warning',
            status === 'processing' && 'bg-info',
            status === 'failed' && 'bg-danger',
            status === 'cancelled' && 'bg-text-tertiary'
          )}
        />
      )}
      <StatusBadge status={config.status} label={config.label} />
    </div>
  )
}
