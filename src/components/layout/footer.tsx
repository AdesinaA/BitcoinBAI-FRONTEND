import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Logo } from '@/components/layout/logo'

interface FooterLink {
  label: string
  href: string
}

interface FooterProps {
  /** Footer link columns. */
  links?: FooterLink[]
  /** Copyright owner (year is computed). */
  copyright?: string
  className?: string
}

const defaultLinks: FooterLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Support', href: '/support' },
]

/**
 * Application footer — brand, secondary links, and copyright.
 */
export function Footer({
  links = defaultLinks,
  copyright = 'Bitcoin BAI',
  className,
}: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className={cn('border-t bg-card', className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Binary network, wallet, and Bitcoin payments.
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t">
        <div className="container flex items-center justify-center py-4">
          <p className="text-xs text-muted-foreground">
            © {year} {copyright}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
