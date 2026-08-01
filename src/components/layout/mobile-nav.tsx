'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Logo } from '@/components/layout/logo'
import { NavLink } from '@/components/layout/nav-link'
import type { NavSection } from '@/components/layout/nav-config'
import { useUIStore } from '@/store/ui-store'

interface MobileNavProps {
  /** Grouped navigation items. */
  sections: NavSection[]
  /** Number of items pinned to the bottom bar (rest live in the drawer). */
  pinnedCount?: number
  className?: string
}

/**
 * Mobile navigation — a fixed bottom bar (guidelines §9.1) with the
 * most-used destinations plus a "Menu" button that opens a slide-in
 * drawer containing the full navigation. Visible below the `md` breakpoint.
 */
export function MobileNav({
  sections,
  pinnedCount = 4,
  className,
}: MobileNavProps) {
  const pathname = usePathname()
  const { mobileNavOpen, setMobileNavOpen } = useUIStore()

  const flatItems = sections.flatMap((s) => s.items)
  const pinned = flatItems.slice(0, pinnedCount)

  return (
    <>
      {/* Bottom bar */}
      <nav
        aria-label="Mobile"
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-card/80 md:hidden',
          className
        )}
      >
        {pinned.map((item) => {
          const Icon = item.icon
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <NavLink
              key={item.href}
              href={item.href}
              exact={item.exact}
              activeClassName="text-accent"
              className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[0.65rem] font-medium text-muted-foreground transition-colors"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="truncate">{item.title}</span>
              <span className={cn('sr-only')}>
                {isActive ? '(current)' : ''}
              </span>
            </NavLink>
          )
        })}
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[0.65rem] font-medium text-muted-foreground transition-colors"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span>Menu</span>
        </button>
      </nav>

      {/* Full navigation drawer */}
      <Drawer open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DrawerContent side="left" className="p-0">
          <DrawerHeader className="border-b">
            <DrawerTitle className="sr-only">Navigation</DrawerTitle>
            <Logo />
          </DrawerHeader>
          <DrawerBody className="py-4">
            <nav className="space-y-6" aria-label="Mobile menu">
              {sections.map((section, sIdx) => (
                <div key={section.label ?? sIdx} className="space-y-1">
                  {section.label ? (
                    <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.label}
                    </p>
                  ) : null}
                  {section.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.href}
                        href={item.href}
                        exact={item.exact}
                        onClick={() => setMobileNavOpen(false)}
                        activeClassName="bg-accent/10 text-accent"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        <span className="flex-1 truncate">{item.title}</span>
                      </NavLink>
                    )
                  })}
                </div>
              ))}
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

/** Convenience hamburger trigger to open the mobile drawer from the header. */
export function MobileNavTrigger({ className }: { className?: string }) {
  const { setMobileNavOpen } = useUIStore()
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Open menu"
      className={cn('md:hidden', className)}
      onClick={() => setMobileNavOpen(true)}
    >
      <Menu className="h-5 w-5" aria-hidden="true" />
    </Button>
  )
}
