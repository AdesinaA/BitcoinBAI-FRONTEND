'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Coins,
  Loader2,
  Percent,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react'

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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import * as poolService from '../services/pool-service'
import type {
  InvestmentHistory,
  Pool,
  PoolReport,
} from '../types'

const PAGE_SIZE = 10

/**
 * Minimum time the invest processing state stays visible. The (simulated)
 * backend responds instantly, so we hold the processing view briefly to
 * make the action feel deliberate and give the user clear feedback.
 */
const MIN_INVEST_PROCESSING_MS = 1800

function formatBtc(amount: number): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}

function formatUsd(amount: number | undefined | null): string {
  if (amount == null) return '—'
  return `$${amount.toLocaleString('en-US')}`
}

function statusVariant(status: string) {
  if (status === 'completed') return 'default' as const
  if (status === 'active') return 'secondary' as const
  return 'outline' as const
}

export function PoolDashboard() {
  const { toast } = useToast()
  const [pools, setPools] = React.useState<Pool[]>([])
  const [history, setHistory] = React.useState<InvestmentHistory | null>(null)
  const [reports, setReports] = React.useState<PoolReport[]>([])
  const [page, setPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(true)
  const [investDialogOpen, setInvestDialogOpen] = React.useState(false)
  const [selectedPool, setSelectedPool] = React.useState<Pool | null>(null)
  const [isInvesting, setIsInvesting] = React.useState(false)
  const [investError, setInvestError] = React.useState('')

  const load = React.useCallback(async () => {
    try {
      const [p, h, r] = await Promise.all([
        poolService.getPools(),
        poolService.getInvestments(page, PAGE_SIZE),
        poolService.getReports(),
      ])
      setPools(p)
      setHistory(h)
      setReports(r)
    } catch (error) {
      toast({
        title: 'Failed to load pools',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, toast])

  React.useEffect(() => {
    setIsLoading(true)
    load()
  }, [load])

  const activePools = pools.filter((p) => p.status === 'active')
  const totalInvested = pools.reduce((sum, p) => sum + p.totalInvested, 0)
  const totalReturns = pools.reduce((sum, p) => sum + p.totalReturns, 0)
  const totalInvestors = reports.reduce((sum, r) => sum + r.investorCount, 0)

  function openInvest(pool: Pool) {
    setSelectedPool(pool)
    setInvestError('')
    setInvestDialogOpen(true)
  }

  async function handleInvest() {
    if (!selectedPool) return
    setInvestError('')
    setIsInvesting(true)
    try {
      // Wait for both the API call and the minimum processing duration,
      // so the loading state is always visible for a smooth, deliberate
      // amount of time even when the API responds instantly.
      const [result] = await Promise.all([
        poolService.invest(selectedPool.poolId, selectedPool.minInvestment),
        new Promise((resolve) => setTimeout(resolve, MIN_INVEST_PROCESSING_MS)),
      ])
      toast({
        title: 'Investment successful',
        description: `${formatBtc(result.amount)} BTC invested in ${result.poolName}. Expected return: ${formatBtc(result.expectedReturn)} BTC.`,
      })
      setInvestDialogOpen(false)
      load()
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      setInvestError(errorMessage)
      toast({
        title: 'Investment failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsInvesting(false)
    }
  }

  if (isLoading && !pools.length) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total invested"
          value={`${formatBtc(totalInvested)} BTC`}
          icon={Coins}
        />
        <StatCard
          title="Total returns"
          value={`${formatBtc(totalReturns)} BTC`}
          icon={TrendingUp}
        />
        <StatCard
          title="Active pools"
          value={String(activePools.length)}
          icon={Percent}
        />
        <StatCard
          title="Total investors"
          value={String(totalInvestors)}
          icon={Users}
        />
      </div>

      {/* Pool catalog */}
      <Card>
        <CardHeader>
          <CardTitle>Available pools</CardTitle>
          <CardDescription>
            Join an investment pool to earn quarterly returns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!activePools.length ? (
            <EmptyState
              icon={Coins}
              title="No active pools"
              description="No investment pools are currently available."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activePools.map((pool) => (
                <Card key={pool.poolId} className="border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{pool.name}</CardTitle>
                    <CardDescription>
                      {pool.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Return rate
                      </span>
                      <span className="font-medium">{pool.returnRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{pool.duration} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium">
                        {formatUsd(pool.priceUsd)} ≈{' '}
                        {formatBtc(pool.minInvestment)} BTC
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total invested
                      </span>
                      <span className="font-medium">
                        {formatBtc(pool.totalInvested)} BTC
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => openInvest(pool)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Invest
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment history */}
      <Card>
        <CardHeader>
          <CardTitle>My investments</CardTitle>
          <CardDescription>
            Your pool investment history and returns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!history || history.investments.length === 0 ? (
            <EmptyState
              icon={Coins}
              title="No investments yet"
              description="Join a pool above to start earning quarterly returns."
            />
          ) : (
            <>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pool</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Expected return</TableHead>
                      <TableHead>Actual return</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>End date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.investments.map((inv) => (
                      <TableRow key={inv.investmentId}>
                        <TableCell className="font-medium">
                          {inv.poolName}
                        </TableCell>
                        <TableCell>
                          {formatBtc(inv.amount)} BTC
                        </TableCell>
                        <TableCell>
                          {formatBtc(inv.expectedReturn)} BTC
                        </TableCell>
                        <TableCell>
                          {formatBtc(inv.actualReturn)} BTC
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(inv.status)}>
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {inv.endDate
                            ? new Date(inv.endDate).toLocaleDateString()
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

      {/* Pool reports */}
      <Card>
        <CardHeader>
          <CardTitle>Pool reports</CardTitle>
          <CardDescription>
            Per-pool investment summary and ROI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!reports.length ? (
            <EmptyState
              icon={Percent}
              title="No pool reports"
              description="Reports will appear once pools have investments."
            />
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total invested</TableHead>
                    <TableHead>Total returns</TableHead>
                    <TableHead>Investors</TableHead>
                    <TableHead>ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((r) => (
                    <TableRow key={r.poolId}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(r.status)}>
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatBtc(r.totalInvested)} BTC
                      </TableCell>
                      <TableCell>
                        {formatBtc(r.totalReturns)} BTC
                      </TableCell>
                      <TableCell>{r.investorCount}</TableCell>
                      <TableCell>{r.roi}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invest dialog */}
      <Dialog
        open={investDialogOpen}
        onOpenChange={(open) => {
          // Lock the dialog while the investment is being processed so the
          // user cannot dismiss it mid-flight (X, Escape or overlay click).
          if (!isInvesting) setInvestDialogOpen(open)
        }}
      >
        <DialogContent hideClose={isInvesting}>
          <DialogHeader>
            <DialogTitle>
              Invest in {selectedPool?.name ?? 'pool'}
            </DialogTitle>
          </DialogHeader>
          {isInvesting ? (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
              <Loader2
                className="h-10 w-10 animate-spin text-gold"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium">Processing investment…</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Please wait while we confirm your investment.
                </p>
              </div>
            </div>
          ) : selectedPool ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">
                    {formatUsd(selectedPool.priceUsd)} ≈{' '}
                    {formatBtc(selectedPool.minInvestment)} BTC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Return rate
                  </span>
                  <span className="font-medium">
                    {selectedPool.returnRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">
                    {selectedPool.duration} days
                  </span>
                </div>
                {investError && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {investError}
                    <Link
                      href="/dashboard/wallet"
                      className="mt-2 block font-medium underline"
                    >
                      Deposit BTC →
                    </Link>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setInvestDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleInvest} disabled={isInvesting}>
                  {isInvesting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isInvesting ? 'Investing...' : 'Confirm investment'}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
