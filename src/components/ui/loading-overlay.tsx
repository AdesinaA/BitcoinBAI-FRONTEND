import * as React from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

export interface LoadingOverlayProps {
  isLoading?: boolean
  message?: string
  className?: string
  fullScreen?: boolean
}

export function LoadingOverlay({
  isLoading = false,
  message = 'Loading...',
  className,
  fullScreen = false,
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        'z-50 flex items-center justify-center',
        fullScreen
          ? 'fixed inset-0 bg-overlay'
          : 'absolute inset-0 bg-surface/80 backdrop-blur-sm',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
    </div>
  )
}
