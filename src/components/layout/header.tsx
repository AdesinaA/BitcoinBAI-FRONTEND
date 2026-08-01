'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { NotificationsBell } from '@/components/layout/notifications-bell'
import { UserMenu } from '@/components/layout/user-menu'
import { MobileNavTrigger } from '@/components/layout/mobile-nav'
import type { NotificationItem } from '@/components/layout/notifications-bell'

interface HeaderProps {
  title?: string
  showBreadcrumbs?: boolean
  user?: { name?: string; email?: string; avatarUrl?: string }
  accountHref?: string
  notifications?: NotificationItem[]
  actions?: React.ReactNode
  showMobileTrigger?: boolean
  className?: string
}

export function Header({
  title,
  showBreadcrumbs = true,
  user,
  accountHref = '/dashboard',
  notifications,
  actions,
  showMobileTrigger = true,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-20 items-center gap-3 border-b border-border/70 bg-background/72 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 md:px-6 lg:px-8',
        className
      )}
    >
      {showMobileTrigger ? <MobileNavTrigger /> : null}

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        {title ? (
          <h1 className="truncate text-base font-semibold leading-tight tracking-[-0.02em] text-text-primary md:text-lg">
            {title}
          </h1>
        ) : null}
        {showBreadcrumbs ? (
          <Breadcrumbs showHome={false} className={cn(title && 'hidden md:flex')} />
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}

      <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 bg-surface/70 p-1 shadow-card">
        <NotificationsBell notifications={notifications} />
        <ThemeToggle />
        <UserMenu
          name={user?.name}
          email={user?.email}
          avatarUrl={user?.avatarUrl}
          accountHref={accountHref}
        />
      </div>
    </header>
  )
}
