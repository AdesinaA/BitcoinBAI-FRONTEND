import * as React from 'react'
import { ArrowRight, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-border/70 pb-5 md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className="max-w-3xl space-y-2">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent/90">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="text-sm leading-6 text-text-secondary md:text-[15px]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function BalanceHero({
  label,
  amount,
  detail,
  trend,
  actions,
  aside,
  className,
}: {
  label: string
  amount: string
  detail?: string
  trend?: React.ReactNode
  actions?: React.ReactNode
  aside?: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn('overflow-hidden border-border-strong/80 bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)/0.12),transparent_26%),linear-gradient(180deg,hsl(var(--surface-elevated)),hsl(var(--surface)))]', className)}>
      <CardContent className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_300px] md:p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
              {label}
            </p>
            <div className="space-y-2">
              <p className="text-balance-hero text-4xl leading-none text-text-primary sm:text-5xl md:text-6xl">
                {amount}
              </p>
              {detail ? <p className="max-w-2xl text-sm text-text-secondary">{detail}</p> : null}
            </div>
            {trend ? <div className="flex flex-wrap items-center gap-3">{trend}</div> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {aside ? (
          <div className="rounded-2xl border border-white/6 bg-black/10 p-4 backdrop-blur-sm md:p-5">
            {aside}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function LedgerMetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'default',
  loading = false,
  className,
}: {
  label: string
  value: string
  detail?: string
  icon?: LucideIcon
  tone?: 'default' | 'success' | 'warning' | 'danger'
  loading?: boolean
  className?: string
}) {
  const toneMap = {
    default: 'text-text-secondary border-border/70 bg-surface',
    success: 'text-success border-success/20 bg-success/5',
    warning: 'text-warning border-warning/20 bg-warning/5',
    danger: 'text-danger border-danger/20 bg-danger/5',
  } as const

  return (
    <Card className={cn('min-h-[148px]', className)}>
      <CardContent className="flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-tertiary">
              {label}
            </p>
            {loading ? (
              <Skeleton className="h-9 w-28" />
            ) : (
              <p className="font-numeric text-2xl font-semibold tracking-[-0.03em] text-text-primary">
                {value}
              </p>
            )}
          </div>
          {Icon ? (
            <div className={cn('rounded-xl border p-2.5', toneMap[tone])}>
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
        </div>
        {detail ? (
          loading ? (
            <Skeleton className="mt-4 h-4 w-36" />
          ) : (
            <p className="mt-4 text-sm text-text-secondary">{detail}</p>
          )
        ) : null}
      </CardContent>
    </Card>
  )
}

export function ActionCard({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
  className,
}: {
  title: string
  description: string
  actionLabel: string
  onAction?: () => void
  icon?: LucideIcon
  className?: string
}) {
  return (
    <Card className={cn('h-full', className)} interactive>
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-base font-semibold tracking-[-0.02em] text-text-primary">{title}</p>
            <p className="text-sm leading-6 text-text-secondary">{description}</p>
          </div>
          {Icon ? (
            <div className="rounded-xl border border-border bg-surface-elevated p-2.5 text-text-secondary">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
        </div>
        <div className="mt-auto">
          <Button variant="secondary" className="w-full justify-between" onClick={onAction}>
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function InsightCard({
  title,
  description,
  badge,
  footer,
  className,
}: {
  title: string
  description: string
  badge?: string
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {badge ? <Badge variant="outline">{badge}</Badge> : null}
        </div>
      </CardHeader>
      {footer ? <CardContent className="pt-0">{footer}</CardContent> : null}
    </Card>
  )
}

export function AttentionStrip({
  title,
  description,
  tone = 'warning',
  action,
}: {
  title: string
  description: string
  tone?: 'warning' | 'danger' | 'info' | 'success'
  action?: React.ReactNode
}) {
  const toneMap = {
    warning: 'border-warning/25 bg-warning/8 text-warning',
    danger: 'border-danger/25 bg-danger/8 text-danger',
    info: 'border-info/25 bg-info/8 text-info',
    success: 'border-success/25 bg-success/8 text-success',
  } as const

  return (
    <div className={cn('flex flex-col gap-3 rounded-2xl border px-4 py-4 md:flex-row md:items-center md:justify-between', toneMap[tone])}>
      <div className="space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}