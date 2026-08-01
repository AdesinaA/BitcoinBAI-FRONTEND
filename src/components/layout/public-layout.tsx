'use client'

import * as React from 'react'

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
 */
export function PublicLayout({ children, className }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex flex-col gap-2 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="sm:hidden">
              <ThemeToggle />
            </div>
          </div>
          <nav aria-label="Public" className="flex flex-wrap items-center gap-2">
            {publicNavItems
              .filter((item) => item.href !== '/')
              .map((item) => (
                <Button key={item.href} variant="ghost" asChild>
                  <NavLink href={item.href} exact={item.exact}>
                    {item.title}
                  </NavLink>
                </Button>
              ))}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      <main className={cn('flex-1', className)}>{children}</main>

      <Footer />
    </div>
  )
}
