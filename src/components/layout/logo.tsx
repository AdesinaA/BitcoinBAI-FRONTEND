import Link from 'next/link'

import { cn } from '@/lib/utils'

interface LogoProps {
  /** Link target (defaults to home). */
  href?: string
  /** Hide the wordmark (icon only), useful in collapsed sidebars. */
  collapsed?: boolean
  className?: string
}

/**
 * Brand mark — the Bitcoin ₿ symbol with a checkmark underneath it,
 * signalling verified Bitcoin settlement on the platform.
 *
 * The ₿ glyph is adapted from lucide's `bitcoin` icon (ISC license),
 * scaled up into the top of the viewBox with the check drawn below.
 * Colors follow the design tokens: accent (`gold`) for the ₿ and
 * `success` green for the checkmark, so it adapts to light/dark themes.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Bitcoin ₿ symbol (top) */}
      <path
        d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"
        transform="translate(3.9 0.3) scale(0.68)"
        strokeWidth={3}
        className="stroke-gold"
      />
      {/* Checkmark underneath */}
      <path d="M7 18.8l3.4 3L17 15.6" strokeWidth={2.8} className="stroke-success" />
    </svg>
  )
}

/**
 * Brand logo — Bitcoin-with-checkmark mark + wordmark, linking home.
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
        <LogoMark className="h-6 w-6" />
      </span>
      {!collapsed ? (
        <span className="text-lg font-bold tracking-tight">
          Bitcoin <span className="text-gradient-gold">BAI</span>
        </span>
      ) : null}
    </Link>
  )
}