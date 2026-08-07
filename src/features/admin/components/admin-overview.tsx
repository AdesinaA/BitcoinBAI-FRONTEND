'use client'

import * as React from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { StatCard } from '@/components/cards/stat-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import * as adminService from '@/features/admin/services/admin-service'
import type { AdminMetrics, AdminStatistics } from '@/features/admin/types'
import {
  Users,
  Wallet,
  ArrowDownUp,
  Activity,
  TrendingUp,
  Clock,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Chart color palette aligned with the design system                  */
/* ------------------------------------------------------------------ */

const CHART_COLORS = {
  gold: '#FFD700',
  goldSoft: '#FFE44D',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  slate: '#64748B',
  muted: '#94A3B8',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
} as const

const STATUS_COLORS: Record<string, string> = {
  active: CHART_COLORS.success,
  inactive: CHART_COLORS.muted,
  suspended: CHART_COLORS.danger,
  pending: CHART_COLORS.warning,
  completed: CHART_COLORS.success,
  approved: CHART_COLORS.info,
  processing: CHART_COLORS.cyan,
  rejected: CHART_COLORS.danger,
}

const TYPE_COLORS: Record<string, string> = {
  deposit: CHART_COLORS.success,
  withdrawal: CHART_COLORS.danger,
  commission: CHART_COLORS.gold,
  referral: CHART_COLORS.purple,
  pool_investment: CHART_COLORS.info,
  pool_return: CHART_COLORS.cyan,
  binary: CHART_COLORS.warning,
  credit: CHART_COLORS.success,
  debit: CHART_COLORS.danger,
}

function getStatusColor(status: string): string {
  return STATUS_COLORS[status.toLowerCase()] ?? CHART_COLORS.slate
}

function getTypeColor(type: string): string {
  return TYPE_COLORS[type.toLowerCase()] ?? CHART_COLORS.slate
}

function formatBtc(value: number): string {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 4 })} BTC`
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/* ------------------------------------------------------------------ */
/* Custom tooltip for charts                                           */
/* ------------------------------------------------------------------ */

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload?: Record<string, unknown> }>
  label?: string
  formatter?: (value: number) => string
}

function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-surface-elevated px-3 py-2 shadow-lg">
      {label && <p className="mb-1 text-xs font-medium text-text-secondary">{label}</p>}
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-text-primary">
          {entry.name}: {formatter ? formatter(entry.value) : entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export function AdminOverview() {
  const { toast } = useToast()
  const [metrics, setMetrics] = React.useState<AdminMetrics | null>(null)
  const [statistics, setStatistics] = React.useState<AdminStatistics | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const [metricsResult, statsResult] = await Promise.allSettled([
          adminService.getMetrics(),
          adminService.getStatistics(),
        ])

        if (metricsResult.status === 'fulfilled') {
          setMetrics(metricsResult.value)
        }
        if (statsResult.status === 'fulfilled') {
          setStatistics(statsResult.value)
        }

        if (metricsResult.status === 'rejected' && statsResult.status === 'rejected') {
          toast({
            title: 'Failed to load analytics',
            description: getApiErrorMessage(metricsResult.reason),
            variant: 'destructive',
          })
        }
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

  /* Transform statistics data for charts */
  const transactionsByTypeData = React.useMemo(() => {
    if (!statistics?.transactionsByType) return []
    return statistics.transactionsByType.map((entry) => ({
      name: capitalizeFirst(entry.type.replace(/_/g, ' ')),
      type: entry.type,
      count: entry.count,
      volume: entry.volume,
    }))
  }, [statistics])

  const usersByStatusData = React.useMemo(() => {
    if (!statistics?.usersByStatus) return []
    return statistics.usersByStatus.map((entry) => ({
      name: capitalizeFirst(entry.status),
      status: entry.status,
      value: entry.count,
    }))
  }, [statistics])

  const withdrawalsByStatusData = React.useMemo(() => {
    if (!statistics?.withdrawalsByStatus) return []
    return statistics.withdrawalsByStatus.map((entry) => ({
      name: capitalizeFirst(entry.status),
      status: entry.status,
      count: entry.count,
      amount: entry.amount,
    }))
  }, [statistics])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
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
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">
          Admin Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide overview and key metrics.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={String(metrics?.users.total ?? 0)}
          icon={Users}
          description={`${metrics?.users.active ?? 0} active · ${metrics?.users.newLast30Days ?? 0} new (30d)`}
        />
        <StatCard
          title="Total Wallet Balance"
          value={formatBtc(metrics?.wallets.totalBalance ?? 0)}
          icon={Wallet}
          description={`${metrics?.wallets.count ?? 0} wallets`}
        />
        <StatCard
          title="Pending Withdrawals"
          value={String(metrics?.withdrawals.pendingCount ?? 0)}
          icon={Clock}
          description={formatBtc(metrics?.withdrawals.pendingAmount ?? 0)}
        />
        <StatCard
          title="Total Transactions"
          value={String(metrics?.transactions.total ?? 0)}
          icon={ArrowDownUp}
          description="All time"
        />
      </div>

      {/* Wallet Flow Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Deposited</p>
              <p className="text-lg font-semibold text-text-primary">
                {formatBtc(metrics?.wallets.totalDeposited ?? 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10">
              <ArrowDownUp className="h-5 w-5 text-danger" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Withdrawn</p>
              <p className="text-lg font-semibold text-text-primary">
                {formatBtc(metrics?.wallets.totalWithdrawn ?? 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Balance</p>
              <p className="text-lg font-semibold text-text-primary">
                {formatBtc(metrics?.wallets.totalPendingBalance ?? 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Activity className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net Flow</p>
              <p className="text-lg font-semibold text-text-primary">
                {formatBtc(
                  (metrics?.wallets.totalDeposited ?? 0) -
                    (metrics?.wallets.totalWithdrawn ?? 0)
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Transaction Volume by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume by Type</CardTitle>
            <CardDescription>Total BTC volume per transaction category</CardDescription>
          </CardHeader>
          <CardContent>
            {transactionsByTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={transactionsByTypeData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--text-tertiary))', fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--text-tertiary))', fontSize: 11 }}
                    width={60}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    content={
                      <ChartTooltip formatter={(v) => formatBtc(v)} />
                    }
                  />
                  <Bar dataKey="volume" name="Volume" radius={[4, 4, 0, 0]}>
                    {transactionsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getTypeColor(entry.type)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No transaction data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Count by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Count by Type</CardTitle>
            <CardDescription>Number of transactions per category</CardDescription>
          </CardHeader>
          <CardContent>
            {transactionsByTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={transactionsByTypeData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--text-tertiary))', fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--text-tertiary))', fontSize: 11 }}
                    width={50}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
                    {transactionsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getTypeColor(entry.type)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No transaction data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Users by Status</CardTitle>
            <CardDescription>Distribution of user account statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {usersByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={usersByStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {usersByStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getStatusColor(entry.status)}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-text-secondary">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No user data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawals by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawals by Status</CardTitle>
            <CardDescription>Withdrawal requests distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {withdrawalsByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={withdrawalsByStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="name"
                    label={({ name, count }) => `${name}: ${count}`}
                  >
                    {withdrawalsByStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getStatusColor(entry.status)}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <ChartTooltip
                        formatter={(v) => `${v} requests`}
                      />
                    }
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-text-secondary">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No withdrawal data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Amounts by Status Table */}
      {withdrawalsByStatusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Amounts by Status</CardTitle>
            <CardDescription>Total BTC amount per withdrawal status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {withdrawalsByStatusData.map((entry) => (
                <div
                  key={entry.status}
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(entry.status) }}
                  />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{entry.name}</p>
                    <p className="text-sm font-semibold text-text-primary">
                      {formatBtc(entry.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.count} request{entry.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}