import * as React from 'react'
import { Calendar, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export type PoolCardStatus = 'active' | 'inactive' | 'completed'

const STATUS_VARIANT: Record<PoolCardStatus, 'success' | 'warning' | 'secondary'> = {
  active: 'success',
  inactive: 'warning',
  completed: 'secondary',
}

export interface PoolCardProps {
  poolId: string
  name: string
  description?: string
  minInvestment: number
  maxInvestment: number
  returnRate: number
  duration: number
  status: PoolCardStatus
  totalInvested: number
  totalReturns: number
  investorCount: number
  roi: number
  startDate?: string
  endDate?: string
  userInvested?: number
  userExpectedReturn?: number
  onClick?: () => void
  onInvest?: () => void
  className?: string
}

/**
 * Premium investment pool card.
 * Shows pool metrics, ROI, progress, and participation status.
 */
export function PoolCard({
  poolId: _poolId,
  name,
  description,
  minInvestment: _minInvestment,
  maxInvestment,
  returnRate,
  duration,
  status,
  totalInvested,
  totalReturns: _totalReturns,
  investorCount,
  roi,
  startDate: _startDate,
  endDate: _endDate,
  userInvested,
  userExpectedReturn,
  onClick,
  onInvest,
  className,
}: PoolCardProps) {
  const roiPositive = roi >= 0
  const progressPct =
    maxInvestment > 0 ? Math.min(100, (totalInvested / maxInvestment) * 100) : 0

  return (
    <Card
      className={cn(
        'border-border/70 transition-all duration-fast hover:shadow-soft',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            {description ? (
              <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                {description}
              </p>
            ) : null}
          </div>
          <Badge variant={STATUS_VARIANT[status]} className="capitalize">
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">
              Return rate
            </p>
            <p className="mt-1 font-numeric text-xl font-semibold text-text-primary">
              {returnRate.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">
              Duration
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
              <Calendar className="h-3.5 w-3.5" />
              {duration} days
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-tertiary">
              {totalInvested.toLocaleString('en-US', {
                minimumFractionDigits: 8,
                maximumFractionDigits: 8,
              })}{' '}
              BTC invested · {investorCount} investors
            </span>
            <span
              className={cn(
                'font-numeric font-semibold',
                roiPositive ? 'text-success' : 'text-danger'
              )}
            >
              {roiPositive ? '+' : ''}
              {roi.toFixed(2)}% ROI
            </span>
          </div>
          <Progress value={progressPct} className="h-1.5" />
        </div>

        {userInvested !== undefined && (
          <div className="border-t border-border/70 pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">Your investment</span>
              <span className="font-numeric font-medium text-text-primary">
                {userInvested.toFixed(8)} BTC
              </span>
            </div>
            {userExpectedReturn !== undefined && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-tertiary">Expected return</span>
                <span className="font-numeric font-medium text-success">
                  +{userExpectedReturn.toFixed(8)} BTC
                </span>
              </div>
            )}
          </div>
        )}

        {onInvest && (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={onInvest}
          >
            Invest
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
