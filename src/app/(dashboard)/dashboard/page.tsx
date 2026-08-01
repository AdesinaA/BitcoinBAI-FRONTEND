'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowDownToLine,
  ArrowRight,
  Bitcoin,
  AlertCircle,
  Coins,
  Network,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'

import {
  getApiErrorMessage,
  isNotInBinaryNetworkError,
} from '@/features/auth/utils/api-error'
import * as walletService from '@/features/wallet/services/wallet-service'
import * as commissionService from '@/features/commission/services/commission-service'
import * as referralService from '@/features/referral/services/referral-service'
import * as binaryService from '@/features/binary/services/binary-service'
import * as poolService from '@/features/pool/services/pool-service'
import type { Transaction, WalletSummary } from '@/features/wallet/types'
import type { CommissionItem, CommissionStatistics } from '@/features/commission/types'
import type { ReferralStatistics } from '@/features/referral/types'
import type { BinaryStatistics } from '@/features/binary/types'
import type { PoolReport } from '@/features/pool/types'
import {
  ActionCard,
  AttentionStrip,
  BalanceHero,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  InsightCard,
  LedgerMetricCard,
  PageShell,
  SectionHeading,
} from '@/components'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { formatBtcCompact } from '@/features/wallet'

interface OverviewState {
  wallet: WalletSummary | null
  commissions: CommissionStatistics | null
  commissionItems: CommissionItem[]
  referrals: ReferralStatistics | null
  binary: BinaryStatistics | null
  pools: PoolReport[]
  transactions: Transaction[]
}

const EMPTY_STATE: OverviewState = {
  wallet: null,
  commissions: null,
  commissionItems: [],
  referrals: null,
  binary: null,
  pools: [],
  transactions: [],
}

const creditTypes = new Set(['deposit', 'commission', 'referral_bonus', 'pool_return'])

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function signedAmount(tx: Transaction) {
  const sign = creditTypes.has(tx.type) ? '+' : '−'
  return `${sign}${formatBtcCompact(tx.amount)} BTC`
}

export default function DashboardOverviewPage() {
  const { toast } = useToast()
  const [data, setData] = React.useState<OverviewState>(EMPTY_STATE)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      const results = await Promise.allSettled([
        walletService.getSummary(),
        commissionService.getStatistics(),
        commissionService.getHistory(1, 5),
        referralService.getStatistics(),
        binaryService.getStatistics(),
        poolService.getReports(),
        walletService.getTransactions({ page: 1, limit: 5 }),
      ])
      if (cancelled) return

      const [wallet, commissions, commissionHistory, referrals, binary, pools, transactions] = results
      setData({
        wallet: wallet.status === 'fulfilled' ? wallet.value : null,
        commissions: commissions.status === 'fulfilled' ? commissions.value : null,
        commissionItems: commissionHistory.status === 'fulfilled' ? commissionHistory.value.commissions : [],
        referrals: referrals.status === 'fulfilled' ? referrals.value : null,
        binary: binary.status === 'fulfilled' ? binary.value : null,
        pools: pools.status === 'fulfilled' ? pools.value : [],
        transactions: transactions.status === 'fulfilled' ? transactions.value.transactions : [],
      })
      setIsLoading(false)

      // "User not in binary network" is an expected state for users who
      // haven't been placed in the binary tree yet — don't surface it as
      // an error toast. Only toast for genuinely unexpected failures.
      const failed = results.find(
        (result) =>
          result.status === 'rejected' && !isNotInBinaryNetworkError(result.reason)
      )
      if (failed?.status === 'rejected') {
        toast({
          title: 'Some overview data could not be loaded',
          description: getApiErrorMessage(failed.reason),
          variant: 'destructive',
        })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [toast])

  const walletBalance = data.wallet?.balance ?? 0
  const totalEarnings = data.commissions?.totalEarnings ?? 0
  const pendingWithdrawals = data.wallet?.pendingWithdrawals ?? 0
  const pendingReferralRewards = data.referrals?.pendingRewards ?? 0
  const activePoolExposure = data.pools.reduce((sum, pool) => sum + pool.totalInvested, 0)
  const leftTeam = data.binary?.leftTeamCount ?? 0
  const rightTeam = data.binary?.rightTeamCount ?? 0

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Private Bitcoin operating system"
        title="Overview"
        description="A five-second command center for balance, earnings, movement, attention, and next action."
        actions={
          <>
            <Button asChild variant="secondary"><Link href="/dashboard/commissions">View earnings</Link></Button>
            <Button asChild variant="primary"><Link href="/dashboard/wallet">Open wallet</Link></Button>
          </>
        }
      />

      {(pendingWithdrawals > 0 || pendingReferralRewards > 0) && !isLoading ? (
        <AttentionStrip
          title="Items require review"
          description={`${pendingWithdrawals} pending withdrawals · ${formatBtcCompact(pendingReferralRewards)} BTC pending referral rewards.`}
          action={<Button asChild variant="secondary" size="sm"><Link href="/dashboard/notifications">Review inbox</Link></Button>}
        />
      ) : null}

      <BalanceHero
        label="Total Bitcoin under your control"
        amount={isLoading ? '— BTC' : `${formatBtcCompact(walletBalance)} BTC`}
        detail="Available wallet balance across deposits, credited rewards, and pool returns."
        trend={
          <>
            <Badge variant="outline" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Secured account</Badge>
            <Badge variant="secondary">{data.wallet?.transactionCount ?? 0} ledger entries</Badge>
          </>
        }
        actions={
          <>
            <Button asChild variant="primary"><Link href="/dashboard/wallet">Deposit or withdraw</Link></Button>
            <Button asChild variant="secondary"><Link href="/dashboard/pools">Evaluate pools</Link></Button>
          </>
        }
        aside={
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-tertiary">Earnings statement</p>
              <p className="mt-2 font-numeric text-3xl font-semibold text-text-primary">{isLoading ? '—' : `${formatBtcCompact(totalEarnings)} BTC`}</p>
              <p className="mt-1 text-sm text-text-secondary">Total credited earnings</p>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-border/70 pt-4">
              <div><p className="text-xs text-text-tertiary">Binary level</p><p className="mt-1 font-semibold text-text-primary">{data.binary?.currentLevel ?? '—'}</p></div>
              <div><p className="text-xs text-text-tertiary">Level progress</p><p className="mt-1 font-semibold text-text-primary">{data.binary?.progress ?? 0}%</p></div>
            </div>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <LedgerMetricCard label="Total earned" value={`${formatBtcCompact(totalEarnings)} BTC`} detail="Binary, referral, level, and pool return credits." icon={Coins} tone="success" loading={isLoading} />
        <LedgerMetricCard label="Network health" value={`${leftTeam} / ${rightTeam}`} detail={`Weaker leg: ${data.binary?.weakerLeg ?? '—'}`} icon={Network} loading={isLoading} />
        <LedgerMetricCard label="Referral engine" value={String(data.referrals?.activeReferrals ?? 0)} detail={`${data.referrals?.totalReferrals ?? 0} total referrals`} icon={Users} loading={isLoading} />
        <LedgerMetricCard label="Pool exposure" value={`${formatBtcCompact(activePoolExposure)} BTC`} detail={`${data.pools.length} reported pools`} icon={Bitcoin} loading={isLoading} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div><CardTitle>Recent ledger movement</CardTitle><p className="mt-1 text-sm text-text-secondary">Latest wallet activity across deposits, withdrawals, and credits.</p></div>
            <Button asChild variant="ghost" size="sm"><Link href="/dashboard/wallet">Full ledger <ArrowRight className="h-4 w-4" /></Link></Button>
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-14 rounded-xl" />)}</div>
              : data.transactions.length ? (
                <div className="divide-y divide-border/70 rounded-2xl border border-border/70">
                  {data.transactions.map((tx) => (
                    <div key={tx.transactionId} className="flex items-center justify-between gap-4 px-4 py-3">
                      <div className="min-w-0"><p className="truncate text-sm font-medium capitalize text-text-primary">{tx.type.replace(/_/g, ' ')}</p><p className="truncate text-xs text-text-secondary">{tx.description ?? formatDate(tx.createdAt)}</p></div>
                      <div className="text-right"><p className={`font-numeric text-sm font-semibold ${creditTypes.has(tx.type) ? 'text-success' : 'text-text-primary'}`}>{signedAmount(tx)}</p><p className="text-xs capitalize text-text-tertiary">{tx.status}</p></div>
                    </div>
                  ))}
                </div>
              ) : <div className="surface-dashed p-8 text-center text-sm text-text-secondary">No ledger activity yet.</div>}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <InsightCard
            title="What changed?"
            description="Earnings and movement are consolidated into one operating view."
            badge="Live"
            footer={<div className="space-y-3">{data.commissionItems.slice(0, 3).map((item) => <div key={item.commissionId} className="flex items-center justify-between gap-3"><div><p className="text-sm font-medium capitalize text-text-primary">{item.type.replace(/_/g, ' ')}</p><p className="text-xs text-text-secondary">{formatDate(item.createdAt)}</p></div><p className="font-numeric text-sm font-semibold text-success">+{formatBtcCompact(item.amount)} BTC</p></div>)}{!data.commissionItems.length && !isLoading ? <p className="text-sm text-text-secondary">No recent earnings posted.</p> : null}</div>}
          />
          <InsightCard
            title="What needs attention?"
            description="Operational issues that could affect confidence or next action."
            badge={pendingWithdrawals > 0 ? 'Review' : 'Clear'}
            footer={<div className="space-y-3 text-sm text-text-secondary"><div className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-warning" />{pendingWithdrawals > 0 ? `${pendingWithdrawals} withdrawal requests pending.` : 'No pending withdrawals.'}</div><div className="flex items-center gap-2"><ArrowDownToLine className="h-4 w-4 text-accent" />{data.wallet?.pendingBalance ? `${formatBtcCompact(data.wallet.pendingBalance)} BTC awaiting confirmation.` : 'No deposits awaiting confirmation.'}</div></div>}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard title="Secure more Bitcoin" description="Use your wallet address to deposit BTC and monitor confirmations." actionLabel="Open wallet" icon={Wallet} onAction={() => window.location.assign('/dashboard/wallet')} />
        <ActionCard title="Analyze earnings" description="Review credited and pending rewards as a financial statement." actionLabel="View earnings" icon={TrendingUp} onAction={() => window.location.assign('/dashboard/commissions')} />
        <ActionCard title="Balance network legs" description="Understand left/right team health before your next placement." actionLabel="Inspect network" icon={Network} onAction={() => window.location.assign('/dashboard/binary')} />
      </div>
    </PageShell>
  )
}
