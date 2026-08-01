'use client'

import * as React from 'react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { StatCard } from '@/components/cards/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import * as userService from '@/features/users/services/user-service'
import * as walletService from '@/features/wallet/services/wallet-service'
import * as commissionService from '@/features/commission/services/commission-service'
import * as poolService from '@/features/pool/services/pool-service'
import { Users, Wallet, Bitcoin, Activity } from 'lucide-react'

interface OverviewData {
  totalUsers: number
  totalWalletBalance: number
  totalCommissions: number
  activePools: number
}

export function AdminOverview() {
  const { toast } = useToast()
  const [data, setData] = React.useState<OverviewData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const [users, wallet, commissions, pools] = await Promise.allSettled([
          userService.listUsers({ limit: 1 }),
          walletService.getSummary(),
          commissionService.getStatistics(),
          poolService.getPools('active'),
        ])

        setData({
          totalUsers: users.status === 'fulfilled' ? users.value.total : 0,
          totalWalletBalance:
            wallet.status === 'fulfilled' ? wallet.value.balance : 0,
          totalCommissions:
            commissions.status === 'fulfilled'
              ? commissions.value.totalEarnings
              : 0,
          activePools: pools.status === 'fulfilled' ? pools.value.length : 0,
        })
      } catch (error) {
        toast({
          title: 'Failed to load analytics',
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-32" />
              <Skeleton className="mt-2 h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">Admin Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide overview and key metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={String(data?.totalUsers ?? 0)}
          icon={Users}
          description="Registered members"
        />
        <StatCard
          title="Total Wallet Balance"
          value={`${data?.totalWalletBalance ?? 0} BTC`}
          icon={Wallet}
          description="Across all wallets"
        />
        <StatCard
          title="Total Commissions"
          value={`${data?.totalCommissions ?? 0} BTC`}
          icon={Bitcoin}
          description="Paid out to members"
        />
        <StatCard
          title="Active Pools"
          value={String(data?.activePools ?? 0)}
          icon={Activity}
          description="Currently running"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Detailed analytics and charts coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
