'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { PageLoading } from '@/components/shared/page-loading'
import { useAuthStore } from '../store/auth-store'

interface AuthGuardProps {
  /** When set, only users with this role may access the children. */
  requireRole?: 'user' | 'admin'
  children: React.ReactNode
}

/**
 * Client-side route guard for protected areas (dashboard, admin).
 * Reads the persisted session from the auth store; if the user is not
 * authenticated they are redirected to /login (preserving the intended
 * destination), and if they lack the required role they are sent to
 * /unauthorized. Renders a loading state while the store rehydrates.
 */
export function AuthGuard({ requireRole, children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [hydrated, setHydrated] = React.useState(false)

  // Wait for zustand/persist to rehydrate the session from localStorage.
  React.useEffect(() => {
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated) return
    if (!isAuthenticated || !user) {
      const redirect = encodeURIComponent(pathname)
      router.replace(`/login?redirect=${redirect}`)
      return
    }
    if (requireRole && user.role !== requireRole) {
      router.replace('/unauthorized')
    }
  }, [hydrated, isAuthenticated, user, requireRole, router, pathname])

  if (!hydrated || !isAuthenticated || !user) {
    return <PageLoading />
  }
  if (requireRole && user.role !== requireRole) {
    return <PageLoading />
  }

  return <>{children}</>
}
