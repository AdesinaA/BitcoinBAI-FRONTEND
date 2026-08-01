import Link from 'next/link'
import { Bitcoin } from 'lucide-react'

import { cn } from '@/lib/utils'

interface LogoProps {
  /** Link target (defaults to home). */
  href?: string
  /** Hide the wordmark (icon only), useful in collapsed sidebars. */
  collapsed?: boolean
  className?: string
}

/**
 * Brand logo — gold Bitcoin mark + wordmark, linking home.
 */
export function Logo({ href = '/', collapsed = false, className }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      aria-label="Bitcoin BAI home"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gold/15">
        <Bitcoin className="h-5 w-5 text-gold" aria-hidden="true" />
      </span>
      {!collapsed ? (
        <span className="text-lg font-bold tracking-tight">
          Bitcoin <span className="text-gradient-gold">BAI</span>
        </span>
      ) : null}
    </Link>
  )
}
