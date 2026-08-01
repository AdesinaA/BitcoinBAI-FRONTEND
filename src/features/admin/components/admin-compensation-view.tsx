'use client'

import * as React from 'react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { StatCard } from '@/components/cards/stat-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import * as commissionService from '@/features/commission/services/commission-service'
import type { CommissionHistory, CommissionStatistics, RewardConfig } from '@/features/commission/types'
import { Bitcoin, Activity, Settings } from 'lucide-react'

export function AdminCompensationView() {
  const { toast } = useToast()
  const [history, setHistory] = React.useState<CommissionHistory | null>(null)
  const [stats, setStats] = React.useState<CommissionStatistics | null>(null)
  const [config, setConfig] = React.useState<RewardConfig | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isProcessing, setIsProcessing] = React.useState(false)

  React.useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const [hist, stat, cfg] = await Promise.all([
          commissionService.getHistory(1, 50),
          commissionService.getStatistics(),
          commissionService.getConfig(),
        ])
        setHistory(hist)
        setStats(stat)
        setConfig(cfg)
      } catch (error) {
        toast({
          title: 'Failed to load compensation data',
          description: getApiErrorMessage(error),
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [toast])

  async function handleProcess() {
    setIsProcessing(true)
    try {
      await commissionService.processAll()
      toast({ title: 'Rewards processed successfully' })
    } catch (error) {
      toast({
        title: 'Processing failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

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
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">Compensation</h1>
        <p className="text-sm text-muted-foreground">
          Manage reward processing, configuration, and commission history.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Earnings"
          value={`${stats?.totalEarnings ?? 0} BTC`}
          icon={Bitcoin}
          description="All-time commissions"
        />
        <StatCard
          title="Commission Count"
          value={String(stats?.count ?? 0)}
          icon={Activity}
          description="Total commissions issued"
        />
        <StatCard
          title="Binary Match"
          value={`${config?.binaryMatchPercent ?? 0}%`}
          icon={Settings}
          description="Match percentage"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward Configuration</CardTitle>
          <CardDescription>
            Current platform reward settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Binary match: {config?.binaryMatchPercent ?? 0}%</p>
          <p>Referral reward: {config?.referralRewardAmount ?? 0} BTC</p>
          <p>Level rewards: {config?.levelRewards?.join(', ') ?? 'N/A'}</p>
          <p>Min match volume: {config?.minMatchVolume ?? 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Commission History</CardTitle>
            <CardDescription>
              Recent commission records across the platform.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={handleProcess}
            isLoading={isProcessing}
          >
            Process All Rewards
          </Button>
        </CardHeader>
        <CardContent>
          {!history || history.commissions.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No commissions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.commissions.map((item) => (
                    <TableRow key={item.commissionId}>
                      <TableCell className="capitalize">
                        {item.type.replace('_', ' ')}
                      </TableCell>
                      <TableCell>{item.amount} BTC</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'paid'
                              ? 'success'
                              : item.status === 'failed'
                              ? 'destructive'
                              : 'warning'
                          }
                          className="capitalize"
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
