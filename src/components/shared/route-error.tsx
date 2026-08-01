'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface RouteErrorProps {
  error: Error & { digest?: string }
  reset: () => void
  /** Heading text (defaults to a generic message). */
  title?: string
  /** Supporting copy. */
  description?: string
}

/**
 * Shared route-level error boundary UI. Used by each segment's
 * `error.tsx` so all routes present a consistent recovery state.
 * Logs the underlying error for diagnostics.
 */
export function RouteError({
  error,
  reset,
  title = 'Something went wrong',
  description = 'An unexpected error occurred while loading this page. Please try again.',
}: RouteErrorProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle
          className="h-6 w-6 text-destructive"
          aria-hidden="true"
        />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      <Button onClick={reset} variant="gold">
        Try again
      </Button>
    </div>
  )
}
