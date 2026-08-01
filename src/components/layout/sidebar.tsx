'use client'

import type * as React from 'react'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ShieldCheck } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/layout/logo'
import { NavLink } from '@/components/layout/nav-link'
import type { NavSection } from '@/components/layout/nav-config'
import { useUIStore } from '@/store/ui-store'

interface SidebarProps {
  sections: NavSection[]
  footer?: React.ReactNode
  className?: string
}

export function Sidebar({ sections, footer, className }: SidebarProps) {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <aside
      data-state={sidebarOpen ? 'expanded' : 'collapsed'}
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/70 bg-background/72 backdrop-blur-xl transition-[width] duration-300 md:flex',
        sidebarOpen ? 'w-72' : 'w-[4.75rem]',
        className
      )}
    >
      <div
        className={cn(
          'flex h-20 items-center border-b border-border/70 px-4',
          sidebarOpen ? 'justify-between' : 'justify-center'
        )}
      >
        <Logo collapsed={!sidebarOpen} />
        {sidebarOpen ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Collapse sidebar"
            onClick={toggleSidebar}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
        ) : null}
      </div>

      {sidebarOpen ? (
        <div className="mx-3 mt-3 rounded-2xl border border-accent/15 bg-accent/5 p-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-accent/20 bg-accent/10 p-2 text-accent">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Sovereign Ledger</p>
              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Private Bitcoin operations console
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="flex-1 space-y-7 overflow-y-auto p-3" aria-label="Primary">
        {sections.map((section, sIdx) => (
          <div key={section.label ?? sIdx} className="space-y-2">
            {section.label && sidebarOpen ? (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-text-tertiary">
                {section.label}
              </p>
            ) : null}
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  exact={item.exact}
                  title={item.title}
                  activeClassName="border-accent/30 bg-accent/10 text-accent shadow-[inset_0_1px_0_hsl(var(--accent)/0.08)]"
                  className={cn(
                    'group flex min-h-11 items-center gap-3 rounded-xl border border-transparent px-3 text-sm font-medium text-text-secondary transition-all duration-base ease-premium hover:border-border hover:bg-surface-elevated/70 hover:text-text-primary',
                    !sidebarOpen && 'justify-center px-0'
                  )}
                >
                  <Icon
                    className={cn('h-[18px] w-[18px] shrink-0', isActive && 'text-accent')}
                    aria-hidden="true"
                  />
                  {sidebarOpen ? (
                    <>
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge ? <Badge variant="gold">{item.badge}</Badge> : null}
                    </>
                  ) : (
                    <span className="sr-only">{item.title}</span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {footer ? <div className="border-t border-border/70 p-3">{footer}</div> : null}
      {!sidebarOpen ? (
        <div className="border-t border-border/70 p-3">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Expand sidebar"
            onClick={toggleSidebar}
            className="mx-auto"
          >
            <ChevronLeft className="rotate-180" aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </aside>
  )
}
