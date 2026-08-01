import { PageLoading } from '@/components/shared/page-loading'

/**
 * Root-level loading UI shown during initial route transitions.
 */
export default function Loading() {
  return (
    <div className="container py-12">
      <PageLoading />
    </div>
  )
}
