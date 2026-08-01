import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

const spinnerVariants = cva('animate-spin text-current', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface SpinnerProps
  extends
    React.HTMLAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {}

/**
 * Minimal inline spinner for action feedback (form submits, button
 * loading, small async areas). For full-content placeholders use
 * `Skeleton` instead (see docs/07_UI_UX_GUIDELINES.md §10).
 */
const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => (
    <Loader2
      ref={ref}
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  )
)
Spinner.displayName = 'Spinner'

export { Spinner, spinnerVariants }
