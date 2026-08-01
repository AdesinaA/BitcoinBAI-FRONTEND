'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { ChevronRight, Home } from 'lucide-react'

import { cn } from '@/lib/utils'
import { allNavItems } from '@/components/layout/nav-config'

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  /** Override the auto-generated items. */
  items?: BreadcrumbItem[]
  /** Show a Home icon as the first crumb. */
  showHome?: boolean
  className?: string
}

function humanize(segment: string): string {
  return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Derives breadcrumb items from the current path, preferring labels
 * from the nav config and falling back to a humanized segment.
 */
function useBreadcrumbItems(): BreadcrumbItem[] {
  const pathname = usePathname()

  return React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = []
    let href = ''
    for (const segment of segments) {
      href += `/${segment}`
      const match = allNavItems.find((item) => item.href === href)
      items.push({ label: match?.title ?? humanize(segment), href })
    }
    return items
  }, [pathname])
}

/**
 * Breadcrumbs — subtle secondary navigation with chevron separators
 * (guidelines §9.3). Auto-generates from the URL unless `items` given.
 */
export function Breadcrumbs({
  items,
  showHome = true,
  className,
}: BreadcrumbsProps) {
  const autoItems = useBreadcrumbItems()
  const crumbs = items ?? autoItems

  if (crumbs.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('flex', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {showHome ? (
          <li className="flex items-center gap-1.5">
            <Link
              href="/"
              aria-label="Home"
              className="flex items-center transition-colors hover:text-foreground"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </li>
        ) : null}
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-foreground"
                >
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
