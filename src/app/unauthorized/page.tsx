import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/layout/logo'

export const metadata: Metadata = { title: 'Access denied' }

/**
 * 403 Unauthorized page — shown when a user lacks permission to view
 * a route (e.g. a member visiting an admin URL).
 */
export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <Logo />
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <ShieldX className="h-8 w-8 text-destructive" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-text-primary">Access denied</h1>
        <p className="max-w-md text-muted-foreground">
          You do not have permission to view this page. If you believe this is a
          mistake, contact an administrator.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="gold">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  )
}
