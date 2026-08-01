import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  loading?: boolean
  className?: string
}

export function ChartCard({
  title,
  description,
  children,
  loading = false,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn('transition-shadow hover:shadow-soft', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
