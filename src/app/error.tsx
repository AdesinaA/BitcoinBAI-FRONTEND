'use client'

import { RouteError } from '@/components/shared/route-error'

/**
 * Root segment error boundary. Catches errors in the root layout/page
 * subtree that are not handled by a more specific route-group boundary.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <RouteError error={error} reset={reset} />
    </div>
  )
}
