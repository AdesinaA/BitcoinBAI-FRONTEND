'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import type { NavSection } from '@/components/layout/nav-config'
import type { NotificationItem } from '@/components/layout/notifications-bell'

interface AppShellProps {
  sections: NavSection[]
  accountHref?: string
  user?: { name?: string; email?: string; avatarUrl?: string }
  notifications?: NotificationItem[]
  sidebarFooter?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function AppShell({
  sections,
  accountHref = '/dashboard',
  user,
  notifications,
  sidebarFooter,
  children,
  className,
}: AppShellProps) {
  return (
    <div className="relative flex min-h-screen w-full overflow-x-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,hsl(var(--accent)/0.10),transparent_28%),radial-gradient(circle_at_85%_18%,hsl(var(--info)/0.055),transparent_24%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background))_42%,hsl(var(--surface)))]"
      />
      <Sidebar sections={sections} footer={sidebarFooter} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header
          user={user}
          accountHref={accountHref}
          notifications={notifications}
        />
        <main
          className={cn(
            'flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8',
            className
          )}
        >
          {children}
        </main>
      </div>

      <MobileNav sections={sections} />
    </div>
  )
}
