import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface PageLoadingProps {
  /** Number of content skeleton blocks to render. */
  blocks?: number
  className?: string
}

/**
 * Shared route-level loading skeleton. Used by each segment's
 * `loading.tsx` so route transitions show a consistent placeholder.
 */
export function PageLoading({ blocks = 3, className }: PageLoadingProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: blocks }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}
