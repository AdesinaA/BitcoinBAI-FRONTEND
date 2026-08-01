'use client'

import * as React from 'react'
import { Bell } from 'lucide-react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface NotificationItem {
  id: string
  title: string
  description?: string
  time?: string
  read?: boolean
}

interface NotificationsBellProps {
  notifications?: NotificationItem[]
  /** Called when a notification is clicked. */
  onSelect?: (id: string) => void
  /** Called to mark all as read. */
  onMarkAllRead?: () => void
  className?: string
}

/**
 * Notifications bell with an unread-count badge and a dropdown list
 * (secondary navigation, guidelines §9.2). Presentational — wire to the
 * notifications feature when it is built.
 */
export function NotificationsBell({
  notifications = [],
  onSelect,
  onMarkAllRead,
  className,
}: NotificationsBellProps) {
  const unread = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
          className={cn('relative', className)}
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unread > 0 ? (
            <Badge
              variant="destructive"
              className="absolute -right-0.5 -top-0.5 h-4 min-w-[1rem] justify-center rounded-full px-1 text-[0.6rem] leading-none"
            >
              {unread > 9 ? '9+' : unread}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-sm font-medium">Notifications</p>
            {unread > 0 ? (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs text-accent hover:underline"
              >
                Mark all read
              </button>
            ) : null}
          </div>
          <DropdownMenuPrimitive.Separator className="-mx-1 my-1 h-px bg-border" />
          {notifications.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {"You're all caught up."}
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <DropdownMenuPrimitive.Item
                  key={n.id}
                  onSelect={() => onSelect?.(n.id)}
                  className="flex cursor-pointer flex-col items-start gap-0.5 rounded-sm px-2 py-2 outline-none transition-colors focus:bg-muted"
                >
                  <div className="flex w-full items-center gap-2">
                    {!n.read ? (
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        className="h-1.5 w-1.5 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span className="flex-1 truncate text-sm font-medium">
                      {n.title}
                    </span>
                    {n.time ? (
                      <span className="text-xs text-muted-foreground">
                        {n.time}
                      </span>
                    ) : null}
                  </div>
                  {n.description ? (
                    <span className="pl-3.5 text-xs text-muted-foreground">
                      {n.description}
                    </span>
                  ) : null}
                </DropdownMenuPrimitive.Item>
              ))}
            </div>
          )}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}
