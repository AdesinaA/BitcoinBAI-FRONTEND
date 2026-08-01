import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'

export interface WalletCardProps {
  title?: string
  label?: string
  balance: string
  currency?: string
  status?: 'active' | 'inactive' | 'pending'
  icon?: React.ReactNode
  loading?: boolean
  isLoading?: boolean
  address?: string
  actions?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function WalletCard({
  title,
  label,
  balance,
  currency = 'BTC',
  status = 'active',
  icon,
  loading = false,
  isLoading = false,
  address,
  actions,
  actionLabel = 'Deposit',
  onAction,
  className,
}: WalletCardProps) {
  const isBusy = loading || isLoading
  const displayTitle = title ?? label ?? 'Wallet'
  const statusMap = {
    active: 'success',
    inactive: 'neutral',
    pending: 'pending',
  } as const

  return (
    <Card className={cn('transition-shadow hover:shadow-soft', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{displayTitle}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isBusy ? (
          <>
            <Skeleton className="mb-2 h-8 w-32" />
            <Skeleton className="mb-4 h-4 w-16" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-text-primary">{balance}</div>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={statusMap[status]} />
              <span className="text-sm text-text-secondary">{currency}</span>
            </div>
            {address ? (
              <p className="mt-3 truncate font-mono text-xs text-text-tertiary">{address}</p>
            ) : null}
          </>
        )}
        {actions ? (
          <div className="mt-4 flex flex-wrap gap-2">{actions}</div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full"
            onClick={onAction}
            disabled={isBusy}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
