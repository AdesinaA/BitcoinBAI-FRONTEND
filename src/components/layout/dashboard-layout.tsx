'use client'

import * as React from 'react'

import { AppShell } from '@/components/layout/app-shell'
import { dashboardNavSections } from '@/components/layout/nav-config'
import type { NotificationItem } from '@/components/layout/notifications-bell'

interface DashboardLayoutProps {
  /** Current user info for the header account menu. */
  user?: { name?: string; email?: string; avatarUrl?: string }
  /** Notifications for the header bell. */
  notifications?: NotificationItem[]
  children: React.ReactNode
}

/**
 * Member dashboard layout — sidebar navigation for wallet, binary,
 * pools, AI, and account, plus header and mobile nav.
 */
export function DashboardLayout({
  user,
  notifications,
  children,
}: DashboardLayoutProps) {
  return (
    <AppShell
      sections={dashboardNavSections}
      accountHref="/dashboard"
      user={user}
      notifications={notifications}
    >
      {children}
    </AppShell>
  )
}
