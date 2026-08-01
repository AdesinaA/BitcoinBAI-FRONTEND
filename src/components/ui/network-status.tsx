import * as React from 'react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/status-badge'

export type NetworkStatusType = 'online' | 'offline' | 'degraded' | 'maintenance'

export interface NetworkStatusProps {
  status: NetworkStatusType
  showIcon?: boolean
  className?: string
}

const statusConfig: Record<
  NetworkStatusType,
  { label: string; status: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending' | 'processing' }
> = {
  online: { label: 'Online', status: 'success' },
  offline: { label: 'Offline', status: 'danger' },
  degraded: { label: 'Degraded', status: 'warning' },
  maintenance: { label: 'Maintenance', status: 'info' },
}

export function NetworkStatus({
  status,
  showIcon = true,
  className,
}: NetworkStatusProps) {
  const config = statusConfig[status]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showIcon && (
        <div
          className={cn(
            'h-2 w-2 rounded-full',
            status === 'online' && 'bg-success',
            status === 'offline' && 'bg-danger',
            status === 'degraded' && 'bg-warning',
            status === 'maintenance' && 'bg-info'
          )}
        />
      )}
      <StatusBadge status={config.status} label={config.label} />
    </div>
  )
}
