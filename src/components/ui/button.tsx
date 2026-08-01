import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Button — Design Language v2.
 * Gold is reserved for the single primary action on a view.
 * Secondary/ghost carry the rest. Never two gold buttons side by side.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
    'text-sm font-medium select-none',
    'transition-all duration-fast ease-premium',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-45',
    'active:scale-[0.985]',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        /** The one gold action per view. */
        primary:
          'bg-accent text-accent-foreground font-semibold shadow-card hover:bg-accent-hover active:bg-accent-active',
        /** @deprecated Alias of `primary`. Migrate to variant="primary". */
        gold: 'bg-accent text-accent-foreground font-semibold shadow-card hover:bg-accent-hover active:bg-accent-active',
        /** Workhorse: bordered charcoal. */
        secondary:
          'border border-border-strong bg-surface-elevated text-text-primary hover:bg-surface-overlay hover:border-text-tertiary/40',
        /** Quiet inline actions. */
        ghost:
          'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
        /** Outlined gold — emphasis without weight. */
        outline:
          'border border-accent/50 text-accent hover:border-accent hover:bg-accent/10',
        /** Destructive confirmations only. */
        destructive:
          'bg-danger text-danger-foreground font-semibold hover:bg-danger/90',
        /** Text-level link affordance. */
        link: 'h-auto p-0 text-accent underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-11 rounded-lg px-6 text-[15px]',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element (e.g. next/link) via Radix Slot. */
  asChild?: boolean
  /** Shows a spinner, disables interaction, keeps width stable. */
  loading?: boolean
  /** @deprecated Alias of `loading`. Migrate to `loading`. */
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isBusy = loading || isLoading
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isBusy}
        aria-busy={isBusy || undefined}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {isBusy ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : null}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }