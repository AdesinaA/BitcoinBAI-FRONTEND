import * as React from 'react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'

export interface NodeCardProps {
  userId: string
  username: string
  fullName?: string
  avatar?: string
  volume: number
  leftCount: number
  rightCount: number
  level: number
  isLeft?: boolean
  isActive?: boolean
  onClick?: () => void
  className?: string
}

/**
 * Premium binary-tree node card.
 * Shows member identity, team counts, volume, and level.
 * Clickable to open member drawer.
 */
export function NodeCard({
  userId: _userId,
  username,
  fullName,
  avatar,
  volume,
  leftCount,
  rightCount,
  level,
  isLeft = false,
  isActive = true,
  onClick,
  className,
}: NodeCardProps) {
  const displayName = fullName ?? username
  const weakerLeg = Math.min(leftCount, rightCount)
  const strongerLeg = Math.max(leftCount, rightCount)
  const balanceRatio = strongerLeg > 0 ? weakerLeg / strongerLeg : 1

  return (
    <Card
      className={cn(
        'group border-border/70 transition-all duration-fast',
        isActive ? 'hover:border-accent/50 hover:shadow-glow-gold' : 'opacity-60',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="md" src={avatar} name={displayName} />
            <div>
              <CardTitle className="text-sm font-medium">
                {displayName}
              </CardTitle>
              <p className="text-xs text-text-tertiary">@{username}</p>
            </div>
          </div>
          <Badge
            variant={isLeft ? 'info' : 'secondary'}
            className="text-[10px]"
          >
            {isLeft ? 'Left' : 'Right'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="font-numeric text-lg font-semibold text-text-primary">
              {leftCount}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">
              Left
            </p>
          </div>
          <div>
            <p className="font-numeric text-lg font-semibold text-text-primary">
              {rightCount}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">
              Right
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-text-tertiary">Volume</span>
          <span className="font-numeric font-medium text-text-primary">
            {volume.toFixed(8)} BTC
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-text-tertiary">Leg balance</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-12 rounded-full bg-surface-elevated">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${balanceRatio * 100}%` }}
              />
            </div>
            <span className="font-numeric text-text-secondary">
              {(balanceRatio * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-text-tertiary">Level</span>
          <Badge variant="outline" className="text-[10px]">
            {level}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
