import Link from 'next/link'
import { Compass } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/layout/logo'

/**
 * 404 Not Found page — shown for unmatched routes.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <Logo />
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Compass className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-gradient-gold">404</h1>
        <p className="max-w-md text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="gold">
          <Link href="/">Return home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
