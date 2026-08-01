'use client'

import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X, Clock, DollarSign, Wallet } from 'lucide-react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import * as adminService from '../services/admin-service'
import type {
  AdminWithdrawalItem,
  ListWithdrawalsParams,
  WithdrawalStatus,
} from '../types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Pagination } from '@/components/ui/pagination'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

const PAGE_SIZE = 20

const STATUS_OPTIONS: { value: WithdrawalStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
]

const STATUS_VARIANT: Record<
  WithdrawalStatus,
  'success' | 'warning' | 'destructive' | 'secondary'
> = {
  pending: 'warning',
  approved: 'success',
  processing: 'secondary',
  completed: 'success',
  rejected: 'destructive',
}

const STATUS_ICON: Record<WithdrawalStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  approved: <Check className="h-4 w-4" />,
  processing: <Clock className="h-4 w-4" />,
  completed: <Check className="h-4 w-4" />,
  rejected: <X className="h-4 w-4" />,
}

const QUERY_KEYS = {
  overview: ['admin', 'wallets-overview'] as const,
  withdrawals: (params: ListWithdrawalsParams) => [
    'admin',
    'withdrawals',
    String(params.page ?? 1),
    String(params.limit ?? PAGE_SIZE),
    params.status ?? '',
  ] as const,
}

const formatBtc = (value: number) => `${value} BTC`

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

export function AdminWalletsView() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [statusFilter, setStatusFilter] = React.useState<WithdrawalStatus | ''>('')
  const [page, setPage] = React.useState(1)
  const [rejectWithdrawal, setRejectWithdrawal] =
    React.useState<AdminWithdrawalItem | null>(null)
  const [rejectReason, setRejectReason] = React.useState('')

  const params: ListWithdrawalsParams = { page, limit: PAGE_SIZE }
  if (statusFilter) params.status = statusFilter

  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
  } = useQuery({
    queryKey: QUERY_KEYS.overview,
    queryFn: adminService.getWalletsOverview,
    staleTime: 60_000,
  })

  const {
    data: withdrawalsData,
    isLoading: withdrawalsLoading,
    error: withdrawalsError,
  } = useQuery({
    queryKey: QUERY_KEYS.withdrawals(params),
    queryFn: () => adminService.listWithdrawals(params),
    staleTime: 30_000,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'wallets-overview'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] })
  }

  const approveMutation = useMutation({
    mutationFn: adminService.approveWithdrawal,
    onSuccess: () => {
      toast({ title: 'Withdrawal approved' })
      invalidate()
    },
    onError: (error) => {
      toast({
        title: 'Approve failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectWithdrawal(id, { reason }),
    onSuccess: () => {
      toast({ title: 'Withdrawal rejected' })
      setRejectWithdrawal(null)
      setRejectReason('')
      invalidate()
    },
    onError: (error) => {
      toast({
        title: 'Reject failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    },
  })

  const handleApprove = (withdrawal: AdminWithdrawalItem) => {
    if (withdrawal.status !== 'pending') return
    approveMutation.mutate(withdrawal.withdrawalId)
  }

  const handleReject = (withdrawal: AdminWithdrawalItem) => {
    if (withdrawal.status !== 'pending') return
    setRejectWithdrawal(withdrawal)
    setRejectReason('')
  }

  const confirmReject = () => {
    if (!rejectWithdrawal) return
    if (rejectReason.length < 3) {
      toast({
        title: 'Reason required',
        description: 'Please provide a reason (3–500 characters).',
        variant: 'destructive',
      })
      return
    }
    rejectMutation.mutate({
      id: rejectWithdrawal.withdrawalId,
      reason: rejectReason,
    })
  }

  const handleStatusChange = (value: WithdrawalStatus | '') => {
    setStatusFilter(value)
    setPage(1)
  }

  const total = withdrawalsData?.total ?? 0
  const totalPages = withdrawalsData?.totalPages ?? 1
  const currentPage = withdrawalsData?.page ?? page
  const withdrawals = withdrawalsData?.withdrawals ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">
          Wallets
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage member wallet balances and withdrawal requests.
        </p>
      </div>

      {/* Wallet overview stat cards */}
      {overviewLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="mt-2 h-6 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : overviewError ? (
        <p className="text-sm text-muted-foreground">
          Failed to load wallet overview.
        </p>
      ) : overview ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Balance"
            value={formatBtc(overview.wallets.totalBalance)}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Pending Balance"
            value={formatBtc(overview.wallets.totalPendingBalance)}
            icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Total Deposited"
            value={formatBtc(overview.wallets.totalDeposited)}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Total Withdrawn"
            value={formatBtc(overview.wallets.totalWithdrawn)}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      ) : null}

      {/* Withdrawal queue */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Queue</CardTitle>
          <div className="flex items-center justify-between pt-2">
            <Select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => handleStatusChange(e as WithdrawalStatus | '')}
              className="sm:w-44"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {withdrawalsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
              ))}
            </div>
          ) : withdrawalsError ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Failed to load withdrawals.
            </p>
          ) : withdrawals.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No withdrawals found.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bitcoin Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((w) => (
                      <TableRow key={w.withdrawalId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{w.userName ?? '—'}</p>
                            <p className="text-xs text-muted-foreground">
                              {w.userEmail ?? '—'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{formatBtc(w.amount)}</TableCell>
                        <TableCell>
                          <span className="font-mono text-xs">
                            {w.bitcoinAddress}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={STATUS_VARIANT[w.status]}
                            className="capitalize"
                          >
                            {STATUS_ICON[w.status]}
                            {w.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {w.createdAt
                            ? new Date(w.createdAt).toLocaleDateString()
                            : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {w.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={approveMutation.isPending}
                                  onClick={() => handleApprove(w)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={rejectMutation.isPending}
                                  onClick={() => handleReject(w)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {w.status !== 'pending' && (
                              <Badge variant="secondary" className="capitalize">
                                {w.status}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {total} withdrawal{total === 1 ? '' : 's'}
                </p>
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Reject confirmation dialog */}
      <Dialog
        open={!!rejectWithdrawal}
        onOpenChange={(open) => {
          if (!open) {
            setRejectWithdrawal(null)
            setRejectReason('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this withdrawal request. The
              reserved funds will be refunded to the user's available balance.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              placeholder="Enter rejection reason (3–500 characters)…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              maxLength={500}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectWithdrawal(null)
                setRejectReason('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={rejectMutation.isPending}
              onClick={confirmReject}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
