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
        <div className="container flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav aria-label="Public" className="flex items-center gap-2">
            {publicNavItems
              .filter((item) => item.href !== '/')
              .map((item) => (
                <Button key={item.href} variant="ghost" asChild>
                  <NavLink href={item.href} exact={item.exact}>
                    {item.title}
                  </NavLink>
                </Button>
              ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className={cn('flex-1', className)}>{children}</main>

      <Footer />
    </div>
  )
}
