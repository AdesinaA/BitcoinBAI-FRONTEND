import * as React from 'react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Logo } from '@/components/layout/logo'

interface AuthCardProps {
  /** Card heading (e.g. "Sign in"). */
  title: string
  /** Supporting text under the heading. */
  description?: string
  /** Form/content area. */
  children?: React.ReactNode
  /** Footer content (e.g. links to other auth pages). */
  footer?: React.ReactNode
  className?: string
}

/**
 * Centered authentication card used by all public auth routes
 * (login, register, verify-email, forgot-password). Provides the
 * brand mark, heading, and a consistent framed container. The actual
 * forms are implemented by the auth feature (not part of routing).
 */
export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        'flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12',
        className
      )}
    >
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          {children ?? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              This authentication form will be implemented by the auth feature.
            </p>
          )}
          {footer ? <div className="mt-4">{footer}</div> : null}
        </CardContent>
      </Card>
    </div>
  )
}
