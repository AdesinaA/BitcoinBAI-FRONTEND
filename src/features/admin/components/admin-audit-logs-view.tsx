'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Shield, User, Globe, Clock } from 'lucide-react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import * as adminService from '../services/admin-service'
import type {
  AuditLogItem,
  ListAuditLogsParams,
  PaginatedAuditLogs,
} from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pagination } from '@/components/ui/pagination'
import { Select } from '@/components/ui/select'
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

const PAGE_SIZE = 20

const TARGET_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All target types' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'setting', label: 'Setting' },
  { value: 'user', label: 'User' },
  { value: 'system', label: 'System' },
]

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
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

export function AdminAuditLogsView() {
  const { toast } = useToast()

  const [page, setPage] = React.useState(1)
  const [actionFilter, setActionFilter] = React.useState('')
  const [targetTypeFilter, setTargetTypeFilter] = React.useState('')

  const params: ListAuditLogsParams = { page, limit: PAGE_SIZE }
  if (actionFilter) params.action = actionFilter
  if (targetTypeFilter) params.targetType = targetTypeFilter

  const {
    data: auditData,
    isLoading,
    error,
    isError,
  } = useQuery<PaginatedAuditLogs>({
    queryKey: [
      'admin',
      'audit-logs',
      String(params.page ?? 1),
      String(params.limit ?? PAGE_SIZE),
      params.action ?? '',
      params.targetType ?? '',
    ],
    queryFn: () => adminService.listAuditLogs(params),
    staleTime: 30_000,
  })

  React.useEffect(() => {
    if (isError && error) {
      toast({
        title: 'Failed to load audit logs',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    }
  }, [isError, error, toast])

  const handleActionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActionFilter(e.target.value)
    setPage(1)
  }

  const handleTargetTypeChange = (value: string) => {
    setTargetTypeFilter(value)
    setPage(1)
  }

  const logs: AuditLogItem[] = auditData?.logs ?? []
  const total = auditData?.total ?? 0
  const totalPages = auditData?.totalPages ?? 1
  const currentPage = auditData?.page ?? page

  const adminActions = logs.filter((l) => l.actorId).length
  const systemEvents = logs.filter((l) => !l.actorId).length
  const last24h = logs.filter(
    (l) =>
      l.createdAt &&
      new Date(l.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">
          Audit Logs
        </h1>
        <p className="text-sm text-muted-foreground">
          System-wide audit trail of administrative actions.
        </p>
      </div>

      {/* Summary stat cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="mt-2 h-6 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Events"
            value={total}
            icon={<Shield className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Admin Actions"
            value={adminActions}
            icon={<User className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="System Events"
            value={systemEvents}
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Last 24h"
            value={last24h}
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Label htmlFor="action-filter" className="sr-only">
            Filter by action
          </Label>
          <Input
            id="action-filter"
            placeholder="Filter by action…"
            value={actionFilter}
            onChange={handleActionChange}
          />
        </div>
        <Select
          aria-label="Filter by target type"
          value={targetTypeFilter}
          onChange={handleTargetTypeChange}
          className="sm:w-44"
        >
          {TARGET_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Audit log table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
              ))}
            </div>
          ) : isError ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Failed to load audit logs.
            </p>
          ) : logs.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No audit logs found.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.auditLogId}>
                        <TableCell>
                          <code className="text-xs">{log.action}</code>
                        </TableCell>
                        <TableCell>
                          {log.actorLabel ?? log.actorId ?? 'system'}
                        </TableCell>
                        <TableCell>
                          {log.targetType}
                          {log.targetId ? `: ${log.targetId}` : ''}
                        </TableCell>
                        <TableCell>{log.ipAddress ?? '—'}</TableCell>
                        <TableCell>
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString()
                            : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {total} event{total === 1 ? '' : 's'}
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
    </div>
  )
}
