import * as React from 'react'
import { Bell, Shield, TrendingUp, Info, Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export type NotificationItemPriority = 'low' | 'medium' | 'high'
export type NotificationItemType =
  | 'security'
  | 'financial'
  | 'system'
  | 'referral'
  | 'commission'
  | 'pool'
  | 'binary'
  | 'general'

const PRIORITY_VARIANT: Record<NotificationItemPriority, 'success' | 'warning' | 'destructive'> = {
  low: 'success',
  medium: 'warning',
  high: 'destructive',
}

const TYPE_ICON: Record<NotificationItemType, React.ReactNode> = {
  security: <Shield className="h-5 w-5" />,
  financial: <TrendingUp className="h-5 w-5" />,
  system: <Info className="h-5 w-5" />,
  referral: <Bell className="h-5 w-5" />,
  commission: <TrendingUp className="h-5 w-5" />,
  pool: <TrendingUp className="h-5 w-5" />,
  binary: <Bell className="h-5 w-5" />,
  general: <Info className="h-5 w-5" />,
}

const TYPE_COLOR: Record<NotificationItemType, string> = {
  security: 'text-danger',
  financial: 'text-success',
  system: 'text-info',
  referral: 'text-accent',
  commission: 'text-success',
  pool: 'text-info',
  binary: 'text-accent',
  general: 'text-text-tertiary',
}

export interface NotificationItemProps {
  id: string
  title: string
  message: string
  type: NotificationItemType
  priority: NotificationItemPriority
  status: 'unread' | 'read' | 'sent'
  createdAt: string
  relatedId?: string | null
  onClick?: () => void
  onMarkRead?: () => void
  className?: string
}

/**
 * Operational notification inbox item.
 * Shows priority, type icon, title, message, timestamp.
 * Unread items have visual emphasis.
 */
export function NotificationItem({
  id: _id,
  title,
  message,
  type,
  priority,
  status,
  createdAt,
  relatedId: _relatedId,
  onClick,
  onMarkRead,
  className,
}: NotificationItemProps) {
  const isUnread = status === 'unread'
  const Icon = TYPE_ICON[type]
  const iconColor = TYPE_COLOR[type]

  return (
    <Card
      className={cn(
        'border-border/70 transition-all duration-fast',
        isUnread && 'border-accent/30 bg-surface-elevated/30',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="flex gap-4 p-4">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            'bg-surface-elevated/70',
            iconColor
          )}
        >
          {Icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className={cn(
                  'text-sm font-medium',
                  isUnread ? 'text-text-primary' : 'text-text-secondary'
                )}
              >
                {title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm text-text-tertiary">
                {message}
              </p>
            </div>
            <Badge variant={PRIORITY_VARIANT[priority]} className="capitalize text-[10px]">
              {priority}
            </Badge>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <time className="text-xs text-text-tertiary">{createdAt}</time>
            {isUnread && onMarkRead ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkRead()
                }}
                className="text-xs text-text-tertiary hover:text-text-primary"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
