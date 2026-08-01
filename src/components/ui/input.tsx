import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Input — Design Language v2.
 * Calm charcoal field, hairline border, gold focus ring.
 * Explicit error/success states for financial forms.
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Validation state. Drives border + ring color and aria-invalid. */
  state?: 'default' | 'error' | 'success'
  /** Leading icon slot. */
  startIcon?: React.ReactNode
  /** Trailing icon / action slot. */
  endIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, state = 'default', startIcon, endIcon, ...props }, ref) => {
    const stateClasses = {
      default:
        'border-input focus-visible:border-accent/60 focus-visible:ring-ring/40',
      error:
        'border-danger/60 focus-visible:border-danger focus-visible:ring-danger/30',
      success:
        'border-success/60 focus-visible:border-success focus-visible:ring-success/30',
    }

    const input = (
      <input
        type={type}
        ref={ref}
        aria-invalid={state === 'error' || undefined}
        className={cn(
          'flex h-10 w-full rounded-md border bg-surface-elevated/50 px-3.5 py-2 text-sm text-text-primary',
          'transition-colors duration-fast',
          'placeholder:text-text-tertiary',
          'focus-visible:outline-none focus-visible:ring-2',
          'disabled:cursor-not-allowed disabled:opacity-45',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-primary',
          stateClasses[state],
          startIcon && 'pl-10',
          endIcon && 'pr-10',
          className
        )}
        {...props}
      />
    )

    if (!startIcon && !endIcon) return input

    return (
      <div className="relative w-full">
        {startIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary [&_svg]:size-4"
          >
            {startIcon}
          </span>
        )}
        {input}
        {endIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary [&_svg]:size-4">
            {endIcon}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }