'use client'

import * as React from 'react'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  RefreshCw,
  Copy,
  Clock,
  // Key, // Hidden: recovery phrase feature commented out
} from 'lucide-react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  PageShell,
  SectionHeading,
  BalanceHero,
  LedgerMetricCard,
  AttentionStrip,
  WalletAddressCard,
  TransactionCard,
  NetworkStatus,
} from '@/components'
import * as walletService from '../services/wallet-service'
import * as bitcoinService from '../services/bitcoin-service'
import type { BlockchainStatus } from '../services/bitcoin-service'
import { formatBtc, formatBtcCompact } from '../index'
import type {
  // MnemonicInfo, // Hidden: recovery phrase feature commented out
  Transaction,
  TransactionStatus,
  TransactionType,
  WalletSummary,
} from '../types'

const PAGE_SIZE = 10

const _STATUS_VARIANT: Record<
  TransactionStatus,
  'success' | 'warning' | 'info' | 'destructive' | 'secondary'
> = {
  completed: 'success',
  pending: 'warning',
  processing: 'info',
  failed: 'destructive',
  cancelled: 'secondary',
}

const CREDIT_TYPES: TransactionType[] = [
  'deposit',
  'commission',
  'referral_bonus',
  'pool_return',
]

function _isCredit(type: TransactionType) {
  return CREDIT_TYPES.includes(type)
}

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString()
}

function _getTypeLabel(type: TransactionType) {
  return type.replace(/_/g, ' ')
}

export function WalletDashboard() {
  const { toast } = useToast()

  const [summary, setSummary] = React.useState<WalletSummary | null>(null)
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isTxLoading, setIsTxLoading] = React.useState(true)
  const [chainStatus, setChainStatus] = React.useState<BlockchainStatus | null>(null)

  const [depositOpen, setDepositOpen] = React.useState(false)
  const [withdrawOpen, setWithdrawOpen] = React.useState(false)
  const [depositAddress, setDepositAddress] = React.useState<string>('')
  const [isDepositing, setIsDepositing] = React.useState(false)

  const [withdrawAmount, setWithdrawAmount] = React.useState('')
  const [withdrawAddress, setWithdrawAddress] = React.useState('')
  const [isWithdrawing, setIsWithdrawing] = React.useState(false)

  // Mnemonic / seed phrase display. (Hidden: recovery phrase feature commented out)
  // const [mnemonicInfo, setMnemonicInfo] =
  //   React.useState<MnemonicInfo | null>(null)
  // const [mnemonicOpen, setMnemonicOpen] = React.useState(false)

  /* ------------------------------- Data loading ---------------------------- */

  const loadSummary = React.useCallback(async () => {
    try {
      const s = await walletService.getSummary()
      setSummary(s)
    } catch (error) {
      toast({
        title: 'Failed to load wallet',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const loadTransactions = React.useCallback(async () => {
    setIsTxLoading(true)
    try {
      const h = await walletService.getTransactions({
        page: 1,
        limit: PAGE_SIZE,
      })
      setTransactions(h.transactions)
    } catch (error) {
      toast({
        title: 'Failed to load transactions',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsTxLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    loadSummary()
  }, [loadSummary])

  React.useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  React.useEffect(() => {
    bitcoinService
      .getBlockchainStatus()
      .then(setChainStatus)
      .catch(() => setChainStatus(null))
  }, [])

  // Auto-sync disabled — wallet balances are managed manually by admins.

  /* ------------------------------ Deposit sync ----------------------------- */

  async function onSyncDeposits() {
    try {
      await bitcoinService.syncDeposits()
      toast({ variant: 'success', title: 'Deposits synced' })
      await Promise.all([loadSummary(), loadTransactions()])
    } catch (error) {
      toast({
        title: 'Sync failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    }
  }

  /* --------------------------------- Deposit ------------------------------- */

  async function onOpenDeposit() {
    setDepositOpen(true)
    if (depositAddress) return
    setIsDepositing(true)
    try {
      const d = await walletService.getDepositAddress()
      setDepositAddress(d.bitcoinAddress)
    } catch (error) {
      toast({
        title: 'Failed to get deposit address',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsDepositing(false)
    }
  }

  async function copyAddress() {
    if (!depositAddress) return
    try {
      await navigator.clipboard.writeText(depositAddress)
      toast({ variant: 'success', title: 'Address copied' })
    } catch {
      toast({ variant: 'destructive', title: 'Copy failed' })
    }
  }

  /* --------------------------------- Withdraw ------------------------------ */

  async function onWithdraw(e: React.FormEvent) {
    e.preventDefault()
    const amount = Number.parseFloat(withdrawAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      toast({ variant: 'destructive', title: 'Enter a valid amount' })
      return
    }
    if (summary && amount > summary.balance) {
      toast({ variant: 'destructive', title: 'Insufficient balance' })
      return
    }
    setIsWithdrawing(true)
    try {
      const result = await walletService.createWithdrawal(amount, withdrawAddress)
      toast({
        variant: 'success',
        title: result.message || 'Withdrawal submitted',
        description: `Net ${formatBtc(result.netAmount)} BTC (fee ${formatBtc(result.fee)}).`,
      })
      setWithdrawOpen(false)
      setWithdrawAmount('')
      setWithdrawAddress('')
      await Promise.all([loadSummary(), loadTransactions()])
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      toast({
        title: errorMsg.includes('Insufficient balance') ? 'Insufficient balance' : 'Withdrawal failed',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  /* --------------------------------- Render -------------------------------- */

  const hasPending = summary && summary.pendingWithdrawals > 0

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Bitcoin wallet"
        title="Wallet"
        description="Your Bitcoin balance, deposit address, and transaction history."
        actions={
          <>
            {/* Recovery phrase button hidden — do not remove, may be re-enabled later.
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setMnemonicOpen(true)
                void walletService
                  .getMnemonic()
                  .then(setMnemonicInfo)
                  .catch(() => setMnemonicInfo(null))
              }}
              aria-label="Show recovery phrase"
            >
              <Key className="h-3.5 w-3.5" />
              Recovery phrase
            </Button>
            */}
            <Button
              variant="secondary"
              size="sm"
              onClick={onSyncDeposits}
              aria-label="Sync deposits"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </>
        }
      />

      {/* Network status */}
      <div className="flex items-center gap-2 text-sm">
        <NetworkStatus
          status={chainStatus?.online ? 'online' : 'offline'}
          showIcon={true}
        />
        {chainStatus ? (
          <span className="text-text-tertiary">
            {chainStatus.network} · block {chainStatus.blockHeight?.toLocaleString() ?? '—'}
          </span>
        ) : (
          <span className="text-text-tertiary">Checking network…</span>
        )}
      </div>

      {/* Pending warning */}
      {hasPending && (
        <AttentionStrip
          title="Pending withdrawals"
          description={`${summary!.pendingWithdrawals} withdrawal${
            summary!.pendingWithdrawals === 1 ? '' : 's'
          } awaiting processing.`}
          tone="warning"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setWithdrawOpen(true)}
            >
              View details
            </Button>
          }
        />
      )}

      {/* Balance hero */}
      <BalanceHero
        label="Available balance"
        amount={summary ? `${formatBtcCompact(summary.balance)} BTC` : '0.00 BTC'}
        detail={
          summary
            ? `${formatBtc(summary.pendingBalance)} BTC pending · ${formatBtcCompact(summary.totalDeposited)} BTC deposited`
            : 'Loading wallet…'
        }
        trend={
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span className="flex items-center gap-1">
              <span className="text-success">+{formatBtcCompact(summary?.totalDeposited ?? 0)}</span>
              deposited
            </span>
            <span className="text-text-tertiary">·</span>
            <span className="flex items-center gap-1">
              <span className="text-warning">{summary?.pendingWithdrawals ?? 0}</span>
              pending
            </span>
          </div>
        }
        actions={
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenDeposit}
              aria-label="Deposit Bitcoin"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Deposit
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setWithdrawOpen(true)}
              aria-label="Withdraw Bitcoin"
            >
              <ArrowUpFromLine className="h-4 w-4" />
              Withdraw
            </Button>
          </>
        }
        aside={
          isLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <WalletAddressCard
              address={summary?.bitcoinAddress ?? ''}
              network={chainStatus?.network ?? 'mainnet'}
              verified={true}
              balance={summary ? `${formatBtcCompact(summary.balance)} BTC` : undefined}
            />
          )
        }
      />

      {/* Summary metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <LedgerMetricCard
          label="Total deposited"
          value={summary ? `${formatBtcCompact(summary.totalDeposited)} BTC` : '—'}
          icon={ArrowDownToLine}
          loading={isLoading}
        />
        <LedgerMetricCard
          label="Total withdrawn"
          value={summary ? `${formatBtcCompact(summary.totalWithdrawn)} BTC` : '—'}
          icon={ArrowUpFromLine}
          loading={isLoading}
        />
        <LedgerMetricCard
          label="Pending balance"
          value={summary ? `${formatBtcCompact(summary.pendingBalance)} BTC` : '—'}
          icon={Clock}
          loading={isLoading}
        />
        <LedgerMetricCard
          label="Transactions"
          value={summary ? String(summary.transactionCount) : '—'}
          icon={History}
          loading={isLoading}
          detail={
            summary && summary.pendingWithdrawals > 0
              ? `${summary.pendingWithdrawals} pending`
              : undefined
          }
        />
      </div>

      {/* Transaction history */}
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="text-base">Recent transactions</CardTitle>
          <CardDescription>
            Your latest wallet activity — deposits, withdrawals, and credits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTxLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-tertiary">
              No transactions yet.
            </p>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <TransactionCard
                  key={tx.transactionId}
                  id={tx.transactionId}
                  type={tx.type}
                  amount={tx.amount}
                  status={tx.status}
                  date={formatDate(tx.createdAt)}
                  description={tx.description}
                  txHash={tx.bitcoinTxId}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deposit dialog */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit Bitcoin</DialogTitle>
            <DialogDescription>
              Send BTC to your unique deposit address. Funds are credited after
              network confirmations.
            </DialogDescription>
          </DialogHeader>
          {isDepositing ? (
            <Skeleton className="h-12 w-full rounded-md" />
          ) : (
            <div className="space-y-3">
              <div className="rounded-md border border-border bg-surface-elevated/40 p-3">
                <p className="break-all font-mono text-sm text-text-primary">
                  {depositAddress}
                </p>
              </div>
              <p className="text-xs text-text-tertiary">
                Only send Bitcoin (BTC) to this address.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepositOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={copyAddress}
              disabled={!depositAddress}
            >
              <Copy className="h-4 w-4" />
              Copy address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mnemonic dialog — hidden, do not remove, may be re-enabled later.
      <Dialog open={mnemonicOpen} onOpenChange={setMnemonicOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Recovery Phrase</DialogTitle>
            <DialogDescription>
              Write down your 12-word recovery phrase and store it securely.
              Anyone with this phrase can access your Bitcoin wallet.
            </DialogDescription>
          </DialogHeader>
          {mnemonicInfo ? (
            <div className="space-y-3">
              <div className="rounded-md border border-border bg-surface-elevated/40 p-3">
                <p className="break-all font-mono text-sm text-text-primary">
                  {mnemonicInfo.mnemonic}
                </p>
              </div>
              <div className="space-y-1 text-xs text-text-tertiary">
                <p>
                  Derivation path:{' '}
                  <span className="font-mono">{mnemonicInfo.derivationPath}</span>
                </p>
                <p>
                  Xpub: <span className="font-mono break-all">{mnemonicInfo.xpub}</span>
                </p>
              </div>
            </div>
          ) : (
            <Skeleton className="h-12 w-full rounded-md" />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMnemonicOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                if (mnemonicInfo) {
                  await navigator.clipboard.writeText(mnemonicInfo.mnemonic)
                  toast({ variant: 'success', title: 'Phrase copied' })
                }
              }}
            >
              <Copy className="h-4 w-4" />
              Copy phrase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      */}

      {/* Withdraw dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Bitcoin</DialogTitle>
            <DialogDescription>
              Available balance:{' '}
              <span className="font-medium text-text-primary">
                {summary ? `${formatBtc(summary.balance)} BTC` : '—'}
              </span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onWithdraw} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (BTC)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                step="0.00000001"
                min="0"
                inputMode="decimal"
                placeholder="0.00000000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdraw-address">Destination Bitcoin address</Label>
              <Input
                id="withdraw-address"
                placeholder="bc1q…"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setWithdrawOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isWithdrawing}>
                Submit withdrawal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
