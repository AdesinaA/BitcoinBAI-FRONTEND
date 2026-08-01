'use client'

import * as React from 'react'
import { Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Logo } from '@/components/layout/logo'
import { Footer } from '@/components/layout/footer'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { NavLink } from '@/components/layout/nav-link'
import { Button } from '@/components/ui/button'
import { publicNavItems } from '@/components/layout/nav-config'

interface PublicLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * Public (marketing/auth) layout — a slim top navbar with brand and
 * primary auth links, centered content, and the shared footer.
 * On mobile the auth links collapse behind a hamburger menu.
 */
export function PublicLayout({ children, className }: PublicLayoutProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)

  const navItems = publicNavItems.filter((item) => item.href !== '/')

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Logo />

          {/* Desktop nav */}
          <nav
            aria-label="Public"
            className="hidden items-center gap-2 sm:flex"
          >
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" asChild>
                <NavLink href={item.href} exact={item.exact}>
                  {item.title}
                </NavLink>
              </Button>
            ))}
            <ThemeToggle />
          </nav>

          {/* Mobile actions */}
          <div className="flex items-center gap-1 sm:hidden">
            <ThemeToggle size="icon-sm" />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="public-mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile collapsible menu */}
        {menuOpen ? (
          <nav
            id="public-mobile-menu"
            aria-label="Public mobile"
            className="border-t sm:hidden"
          >
            <div className="container flex flex-col gap-1 py-3">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <NavLink
                    href={item.href}
                    exact={item.exact}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.title}
                  </NavLink>
                </Button>
              ))}
            </div>
          </nav>
        ) : null}
      </header>

      <main className={cn('flex-1', className)}>{children}</main>

      <Footer />
    </div>
  )
}