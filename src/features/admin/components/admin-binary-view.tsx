'use client'

import * as React from 'react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import * as binaryService from '@/features/binary/services/binary-service'
import type { BinaryStatistics } from '@/features/binary/types'
import { Network, Users, TrendingUp } from 'lucide-react'

export function AdminBinaryView() {
  const { toast } = useToast()
  const [stats, setStats] = React.useState<BinaryStatistics | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await binaryService.getStatistics()
        setStats(data)
      } catch (error) {
        toast({
          title: 'Failed to load binary statistics',
          description: getApiErrorMessage(error),
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [toast])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">Binary Network</h1>
        <p className="text-sm text-muted-foreground">
          Overview of the binary tree structure and network metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Left Team
            </CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-numeric text-2xl font-semibold tracking-[-0.03em] text-text-primary">
              {stats?.leftTeamCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Volume: {stats?.leftTeamVolume ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Right Team
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-numeric text-2xl font-semibold tracking-[-0.03em] text-text-primary">
              {stats?.rightTeamCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Volume: {stats?.rightTeamVolume ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-numeric text-2xl font-semibold tracking-[-0.03em] text-text-primary">
              {stats?.totalEarnings ?? 0} BTC
            </div>
            <p className="text-xs text-muted-foreground">
              Weaker leg: {stats?.weakerLeg ?? 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Binary Tree</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Detailed binary tree visualization coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
