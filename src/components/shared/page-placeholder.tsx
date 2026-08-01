import * as React from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'

interface PagePlaceholderProps {
  /** Section/feature title. */
  title: string
  /** Short description of what will live here. */
  description?: string
  /** Optional icon for the placeholder. */
  icon?: LucideIcon
  className?: string
}

/**
 * Route scaffolding placeholder. Renders a consistent "coming soon"
 * block for routes whose structure exists but whose feature logic has
 * not been implemented yet (keeps BB-007 free of business logic).
 */
export function PagePlaceholder({
  title,
  description = 'This section is under construction.',
  icon,
  className,
}: PagePlaceholderProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <EmptyState
        icon={icon}
        title={`${title} coming soon`}
        description="The routing and layout for this section are ready. Feature content will be implemented in a later task."
      />
    </div>
  )
}
