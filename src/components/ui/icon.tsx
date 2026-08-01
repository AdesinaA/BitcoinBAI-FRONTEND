import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon, LucideProps } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Icon system
 * -----------
 * Lucide React is the single icon library for the platform
 * (see docs/07_UI_UX_GUIDELINES.md §7). This module provides a
 * size-variant wrapper (`Icon`) plus a curated re-export of the
 * icons used across the design system, so consumers never hard-code
 * arbitrary icon choices or sizes.
 */

const iconVariants = cva('shrink-0', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface IconProps
  extends Omit<LucideProps, 'size'>, VariantProps<typeof iconVariants> {
  /** The Lucide icon component to render. */
  icon: LucideIcon
}

/**
 * Renders a Lucide icon at a consistent design-system size.
 *
 * @example
 * <Icon icon={Wallet} size="sm" className="text-accent" />
 */
const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: LucideComponent, size, className, ...props }, ref) => (
    <LucideComponent
      ref={ref}
      className={cn(iconVariants({ size }), className)}
      aria-hidden="true"
      {...props}
    />
  )
)
Icon.displayName = 'Icon'

export { Icon, iconVariants }

/* Curated, design-system-approved icons (single source of truth). */
export {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bitcoin,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Info,
  Loader2,
  LogOut,
  Menu,
  Minus,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sun,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
  XCircle,
} from 'lucide-react'

export type { LucideIcon }
