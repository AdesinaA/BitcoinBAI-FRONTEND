'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  /** When true, active only on an exact path match. */
  exact?: boolean
  /** Extra classes applied when the link is active. */
  activeClassName?: string
  children: React.ReactNode
}

/**
 * Next.js Link that knows its active state from the current pathname.
 * Applies `data-active` plus `activeClassName` when active.
 */
export function NavLink({
  href,
  exact = false,
  activeClassName,
  className,
  children,
  ...props
}: NavLinkProps) {
  const pathname = usePathname()
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      data-active={isActive || undefined}
      aria-current={isActive ? 'page' : undefined}
      className={cn(className, isActive && activeClassName)}
      {...props}
    >
      {children}
    </Link>
  )
}
