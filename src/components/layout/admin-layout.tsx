'use client'

import * as React from 'react'

import { AppShell } from '@/components/layout/app-shell'
import { adminNavSections } from '@/components/layout/nav-config'
import type { NotificationItem } from '@/components/layout/notifications-bell'

interface AdminLayoutProps {
  /** Current admin user info for the header account menu. */
  user?: { name?: string; email?: string; avatarUrl?: string }
  /** Notifications for the header bell. */
  notifications?: NotificationItem[]
  children: React.ReactNode
}

/**
 * Admin console layout — sidebar navigation for user management,
 * transactions, and platform settings. Shares the authenticated
 * app shell with the dashboard but scoped to admin routes.
 */
export function AdminLayout({
  user,
  notifications,
  children,
}: AdminLayoutProps) {
  return (
    <AppShell
      sections={adminNavSections}
      accountHref="/admin"
      user={user}
      notifications={notifications}
    >
      {children}
    </AppShell>
  )
}
