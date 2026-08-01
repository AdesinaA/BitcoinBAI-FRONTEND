import * as React from 'react'
import { Inbox, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lucide icon displayed above the title. */
  icon?: LucideIcon
  /** Short heading explaining the empty state. */
  title: string
  /** Optional supporting description. */
  description?: string
  /** Optional primary action (e.g. a Button) to resolve the empty state. */
  action?: React.ReactNode
}

/**
 * Friendly empty-state block for lists, tables, and panels.
 * Provides an icon, a clear message, and an optional call-to-action
 * (see docs/07_UI_UX_GUIDELINES.md §11.3 / §21.2).
 */
function EmptyState({
  icon: IconComponent = Inbox,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-10 text-center',
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <IconComponent
          className="h-6 w-6 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export { EmptyState }
