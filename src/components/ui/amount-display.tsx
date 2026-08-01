import * as React from 'react'
import { cn } from '@/lib/utils'

export interface AmountDisplayProps {
  amount: number | string
  currency?: string
  prefix?: string
  decimals?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AmountDisplay({
  amount,
  currency = 'BTC',
  prefix = '',
  decimals = 8,
  size = 'md',
  className,
}: AmountDisplayProps) {
  const formattedAmount =
    typeof amount === 'number'
      ? amount.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: decimals,
        })
      : amount

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-bold',
  }

  return (
    <span
      className={cn(
        'font-mono text-text-primary',
        sizeClasses[size],
        className
      )}
      aria-label={`Amount: ${prefix}${formattedAmount} ${currency}`}
    >
      {prefix}
      {formattedAmount}
      {currency && (
        <span className="text-sm text-text-secondary"> {currency}</span>
      )}
    </span>
  )
}
