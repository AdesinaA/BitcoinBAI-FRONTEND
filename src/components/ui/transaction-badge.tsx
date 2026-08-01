import * as React from 'react'
import { Badge } from '@/components/ui/badge'

export type TransactionBadgeType =
  | 'deposit'
  | 'withdrawal'
  | 'transfer'
  | 'commission'
  | 'reward'
  | 'fee'

export interface TransactionBadgeProps {
  type: TransactionBadgeType
  className?: string
}

const typeConfig: Record<
  TransactionBadgeType,
  { label: string; variant: 'gold' | 'success' | 'warning' | 'info' | 'destructive' | 'secondary' | 'default' | 'outline' }
> = {
  deposit: { label: 'Deposit', variant: 'success' },
  withdrawal: { label: 'Withdrawal', variant: 'warning' },
  transfer: { label: 'Transfer', variant: 'info' },
  commission: { label: 'Commission', variant: 'gold' },
  reward: { label: 'Reward', variant: 'success' },
  fee: { label: 'Fee', variant: 'destructive' },
}

export function TransactionBadge({
  type,
  className,
}: TransactionBadgeProps) {
  const config = typeConfig[type]
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
