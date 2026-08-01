import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative flex items-start gap-3 rounded-md border px-4 py-3 text-sm',
  {
    variants: {
      variant: {
        default:
          'border-border bg-surface text-text-primary',
        success:
          'border-success/20 bg-success/10 text-success',
        warning:
          'border-warning/20 bg-warning/10 text-warning',
        danger:
          'border-danger/20 bg-danger/10 text-danger',
        info:
          'border-info/20 bg-info/10 text-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        role="alert"
        {...props}
      >
        <div className="flex-1">
          {title && (
            <h3 className="font-medium mb-1">{title}</h3>
          )}
          {children}
        </div>
      </div>
    )
  }
)
Alert.displayName = 'Alert'

export { Alert, alertVariants }
