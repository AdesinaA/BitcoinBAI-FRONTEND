'use client'

import * as React from 'react'
import { Coins, Gift, Loader2, Percent, RefreshCw, TrendingUp } from 'lucide-react'

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
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
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
import * as commissionService from '../services/commission-service'
import type {
  CommissionHistory,
  CommissionStatistics,
  RewardConfig,
} from '../types'

const PAGE_SIZE = 10

function formatBtc(amount: number): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}

function statusVariant(status: string) {
  if (status === 'credited' || status === 'paid') return 'default' as const
  if (status === 'pending') return 'secondary' as const
  return 'outline' as const
}

const TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'binary', label: 'Binary' },
  { value: 'referral', label: 'Referral' },
  { value: 'level_reward', label: 'Level reward' },
  { value: 'pool_return', label: 'Pool return' },
]

export function CommissionDashboard() {
  const { toast } = useToast()
  const [stats, setStats] = React.useState<CommissionStatistics | null>(null)
  const [config, setConfig] = React.useState<RewardConfig | null>(null)
  const [history, setHistory] = React.useState<CommissionHistory | null>(null)
  const [page, setPage] = React.useState(1)
  const [typeFilter, setTypeFilter] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const load = React.useCallback(async () => {
    try {
      const [s, c, h] = await Promise.all([
        commissionService.getStatistics(),
        commissionService.getConfig(),
        commissionService.getHistory(page, PAGE_SIZE, typeFilter || undefined),
      ])
      setStats(s)
      setConfig(c)
      setHistory(h)
    } catch (error) {
      toast({
        title: 'Failed to load commissions',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, typeFilter, toast])

  React.useEffect(() => {
    setIsLoading(true)
    load()
  }, [load])

  async function handleProcess() {
    setIsProcessing(true)
    try {
      const result = await commissionService.processAll()
      toast({
        title: 'Rewards processed',
        description: `${result.binary.processed} binary, ${result.levels.processed} level, ${result.referrals.processed} referral rewards credited.`,
      })
      load()
    } catch (error) {
      toast({
        title: 'Failed to process rewards',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading && !stats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total earnings"
          value={`${formatBtc(stats?.totalEarnings ?? 0)} BTC`}
          icon={Coins}
        />
        <StatCard
          title="Total rewards"
          value={String(stats?.count ?? 0)}
          icon={Gift}
        />
        <StatCard
          title="Binary rewards"
          value={`${formatBtc(stats?.byType.binary ?? 0)} BTC`}
          icon={Percent}
        />
        <StatCard
          title="Referral rewards"
          value={`${formatBtc(stats?.byType.referral ?? 0)} BTC`}
          icon={TrendingUp}
        />
      </div>

      {/* Reward configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reward configuration</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {isProcessing ? 'Processing...' : 'Process rewards'}
            </Button>
          </CardTitle>
          <CardDescription>
            Database-driven reward parameters. Process rewards to credit
            pending binary, level, and referral rewards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {config ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Binary match %
                </p>
                <p className="font-semibold">{config.binaryMatchPercent}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Referral reward
                </p>
                <p className="font-semibold">
                  {formatBtc(config.referralRewardAmount)} BTC
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Min match volume
                </p>
                <p className="font-semibold">
                  {formatBtc(config.minMatchVolume)} BTC
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Level rewards
                </p>
                <p className="font-semibold">
                  {config.levelRewards
                    .map((r) => formatBtc(r))
                    .join(', ')}
                </p>
              </div>
            </div>
          ) : (
            <Skeleton className="h-16 rounded-lg" />
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Commission history</CardTitle>
          <CardDescription>
            Your reward earnings and their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-end gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-48 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {!history || history.commissions.length === 0 ? (
            <EmptyState
              icon={Coins}
              title="No commissions yet"
              description="Rewards will appear here once they are processed."
            />
          ) : (
            <>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.commissions.map((c) => (
                      <TableRow key={c.commissionId}>
                        <TableCell>
                          <Badge variant="secondary">{c.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatBtc(c.amount)} BTC
                        </TableCell>
                        <TableCell>{c.level ?? '—'}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(c.status)}>
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                          {c.description ?? '—'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString()
                            : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {history.pagination.totalPages > 1 ? (
                <div className="mt-4">
                  <Pagination
                    page={history.pagination.page}
                    totalPages={history.pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
