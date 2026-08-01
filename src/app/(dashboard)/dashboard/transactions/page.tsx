'use client'

import * as React from 'react'
import { ExternalLink, Copy } from 'lucide-react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Drawer, DrawerTrigger, DrawerContent } from '@/components/ui/drawer'
import {
  PageShell,
  SectionHeading,
  FilterBar,
  DataTable,
  type ColumnDef,
  type FilterDefinition,
  type ActiveFilter,
} from '@/components'
import * as walletService from '@/features/wallet/services/wallet-service'
import { formatBtc, formatBtcCompact } from '@/features/wallet'
import type {
  Transaction,
  TransactionHistory,
  TransactionStatus,
  TransactionType,
} from '@/features/wallet/types'

const PAGE_SIZE = 20

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All types' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'commission', label: 'Commission' },
  { value: 'referral_bonus', label: 'Referral bonus' },
  { value: 'pool_investment', label: 'Pool investment' },
  { value: 'pool_return', label: 'Pool return' },
  { value: 'activation', label: 'Activation' },
  { value: 'adjustment', label: 'Adjustment' },
]

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_VARIANT: Record<
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

function isCredit(type: TransactionType) {
  return CREDIT_TYPES.includes(type)
}

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
}

export default function TransactionsPage() {
  const { toast } = useToast()

  const [history, setHistory] = React.useState<TransactionHistory | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [typeFilter, setTypeFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('')
  const [searchValue, setSearchValue] = React.useState('')

  const loadTransactions = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const h = await walletService.getTransactions({
        page,
        limit: PAGE_SIZE,
        type: (typeFilter || undefined) as TransactionType | undefined,
        status: (statusFilter || undefined) as TransactionStatus | undefined,
      })
      setHistory(h)
    } catch (error) {
      toast({
        title: 'Failed to load transactions',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, typeFilter, statusFilter, toast])

  React.useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  // Filter by search
  const filteredTransactions = React.useMemo(() => {
    if (!history) return []
    if (!searchValue.trim()) return history.transactions

    const lower = searchValue.toLowerCase()
    return history.transactions.filter(
      (tx) =>
        tx.type.toLowerCase().includes(lower) ||
        (tx.description?.toLowerCase().includes(lower) ?? false) ||
        (tx.bitcoinTxId?.toLowerCase().includes(lower) ?? false)
    )
  }, [history, searchValue])

  const columns: ColumnDef<Transaction>[] = [
    {
      key: 'type',
      header: 'Type',
      cell: (row) => (
        <span className="capitalize">
          {row.type.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      cell: (row) => (
        <span className="max-w-[280px] truncate text-text-tertiary">
          {row.description ?? '—'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      numeric: true,
      cell: (row) => (
        <span
          className={
            isCredit(row.type) ? 'text-success' : 'text-text-primary'
          }
        >
          {isCredit(row.type) ? '+' : '−'}
          {formatBtc(row.amount)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge
          variant={STATUS_VARIANT[row.status]}
          className="capitalize"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      cell: (row) => (
        <span className="whitespace-nowrap text-text-tertiary">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (row) => (
        <TransactionDrawer tx={row}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            aria-label={`View ${row.type} details`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </TransactionDrawer>
      ),
    },
  ]

  const filterDefs: FilterDefinition[] = [
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      value: typeFilter,
      onChange: (v) => {
        setTypeFilter(v)
        setPage(1)
      },
      options: TYPE_OPTIONS,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      value: statusFilter,
      onChange: (v) => {
        setStatusFilter(v)
        setPage(1)
      },
      options: STATUS_OPTIONS,
    },
  ]

  const activeFilters: ActiveFilter[] = []
  if (typeFilter) {
    activeFilters.push({
      key: 'type',
      label: 'Type',
      value: TYPE_OPTIONS.find((o) => o.value === typeFilter)?.label ?? typeFilter,
    })
  }
  if (statusFilter) {
    activeFilters.push({
      key: 'status',
      label: 'Status',
      value: STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? statusFilter,
    })
  }

  const clearAllFilters = () => {
    setTypeFilter('')
    setStatusFilter('')
    setPage(1)
  }

  const handleRemoveFilter = (key: string) => {
    if (key === 'type') setTypeFilter('')
    if (key === 'status') setStatusFilter('')
  }

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Financial ledger"
        title="Transactions"
        description="Complete history of deposits, withdrawals, and credits to your Bitcoin BAI wallet."
      />

      <FilterBar
        searchPlaceholder="Search by type, description, or txid…"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filterDefs}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={clearAllFilters}
        activeCount={activeFilters.length}
      />

      <DataTable
        columns={columns}
        data={filteredTransactions}
        searchPlaceholder="Search transactions…"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        loading={isLoading}
        emptyMessage="No transactions found."
        pagination={
          history
            ? {
                page: history.pagination.page,
                totalPages: history.pagination.totalPages,
                pageSize: PAGE_SIZE,
                totalItems: history.pagination.total,
                onPageChange: setPage,
              }
            : undefined
        }
      />
    </PageShell>
  )
}

/* --------------------------- Transaction Drawer --------------------------- */

function TransactionDrawer({
  tx,
  children,
}: {
  tx: Transaction
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const { toast } = useToast()

  async function copyTxId() {
    if (!tx.bitcoinTxId) return
    try {
      await navigator.clipboard.writeText(tx.bitcoinTxId)
      toast({ variant: 'success', title: 'Transaction ID copied' })
    } catch {
      toast({ variant: 'destructive', title: 'Copy failed' })
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">
              Transaction details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-tertiary">Type</p>
                  <p className="font-medium text-text-primary capitalize">
                    {tx.type.replace(/_/g, ' ')}
                  </p>
                </div>
                <Badge
                  variant={STATUS_VARIANT[tx.status]}
                  className="capitalize"
                >
                  {tx.status}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-text-tertiary">Amount</p>
                <p className="font-numeric text-2xl font-semibold">
                  <span className={isCredit(tx.type) ? 'text-success' : 'text-text-primary'}>
                    {isCredit(tx.type) ? '+' : '−'}
                  </span>
                  {formatBtc(tx.amount)} BTC
                </p>
                <p className="text-xs text-text-tertiary">
                  {formatBtcCompact(tx.amount)} BTC compact
                </p>
              </div>

              {tx.description && (
                <div>
                  <p className="text-sm text-text-tertiary">Description</p>
                  <p className="text-sm text-text-primary">{tx.description}</p>
                </div>
              )}

              {tx.bitcoinTxId && (
                <div>
                  <p className="text-sm text-text-tertiary">Bitcoin TXID</p>
                  <div className="flex items-center gap-2">
                    <code className="break-all text-xs text-text-primary">
                      {tx.bitcoinTxId}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={copyTxId}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-tertiary">Created</p>
                  <p className="text-sm text-text-primary">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">Completed</p>
                  <p className="text-sm text-text-primary">
                    {formatDate(tx.completedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">Confirmations</p>
                  <p className="text-sm text-text-primary">{tx.confirmations}</p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">Transaction ID</p>
                  <p className="font-mono text-sm text-text-primary">
                    {tx.transactionId}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DrawerContent>
    </Drawer>
  )
}
