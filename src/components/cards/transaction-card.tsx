import * as React from 'react'
import { ArrowDown, ArrowUp, Clock, ExternalLink } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export type TransactionCardStatus = 'completed' | 'pending' | 'processing' | 'failed' | 'cancelled'
export type TransactionCardType =
  | 'deposit'
  | 'withdrawal'
  | 'commission'
  | 'referral_bonus'
  | 'pool_investment'
  | 'pool_return'
  | 'activation'
  | 'subscription'
  | 'adjustment'

const STATUS_VARIANT: Record<TransactionCardStatus, 'success' | 'warning' | 'info' | 'destructive' | 'secondary'> = {
  completed: 'success',
  pending: 'warning',
  processing: 'info',
  failed: 'destructive',
  cancelled: 'secondary',
}

const CREDIT_TYPES: TransactionCardType[] = [
  'deposit',
  'commission',
  'referral_bonus',
  'pool_return',
]

const TYPE_LABELS: Record<TransactionCardType, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  commission: 'Commission',
  referral_bonus: 'Referral Bonus',
  pool_investment: 'Pool Investment',
  pool_return: 'Pool Return',
  activation: 'Activation',
  subscription: 'Subscription',
  adjustment: 'Adjustment',
}

export interface TransactionCardProps {
  id: string
  type: TransactionCardType
  amount: number
  status: TransactionCardStatus
  description?: string
  date?: string
  txHash?: string
  onClick?: () => void
  className?: string
}

/**
 * Premium transaction list item.
 * Shows type, amount with sign, status badge, date, and optional blockchain link.
 * Clickable to open detail drawer.
 */
export function TransactionCard({
  id: _id,
  type,
  amount,
  status,
  description,
  date,
  txHash,
  onClick,
  className,
}: TransactionCardProps) {
  const isCredit = CREDIT_TYPES.includes(type)
  const _isDebit = !isCredit
  const label = TYPE_LABELS[type] ?? type.replace(/_/g, ' ')

  return (
    <Card
      className={cn(
        'border-border/70 transition-all duration-fast hover:border-border-strong hover:shadow-soft',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              isCredit
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger'
            )}
          >
            {isCredit ? (
              <ArrowDown className="h-5 w-5" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-text-primary">{label}</p>
              <Badge variant={STATUS_VARIANT[status]} className="capitalize text-[10px]">
                {status}
              </Badge>
            </div>
            {description ? (
              <p className="mt-0.5 max-w-md truncate text-sm text-text-secondary">
                {description}
              </p>
            ) : null}
            {date ? (
              <div className="mt-1 flex items-center gap-1 text-xs text-text-tertiary">
                <Clock className="h-3 w-3" />
                {date}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p
              className={cn(
                'font-numeric font-semibold',
                isCredit ? 'text-success' : 'text-text-primary'
              )}
            >
              {isCredit ? '+' : '−'}
              {amount.toLocaleString('en-US', {
                minimumFractionDigits: 8,
                maximumFractionDigits: 8,
              })}{' '}
              BTC
            </p>
          </div>
          {txHash ? (
            <a
              href={`https://mempool.space/testnet/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded p-1 text-text-tertiary hover:bg-surface-elevated hover:text-text-primary"
              aria-label="View on blockchain"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
