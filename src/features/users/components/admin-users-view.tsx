'use client'

import * as React from 'react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Pagination } from '@/components/ui/pagination'
import { SearchInput } from '@/components/ui/search-input'
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
import * as userService from '../services/user-service'
import type {
  PaginatedUsers,
  UserProfile,
  UserRole,
  UserStatus,
} from '../types'

const PAGE_SIZE = 10

const STATUS_VARIANT: Record<
  UserStatus,
  'success' | 'warning' | 'destructive' | 'secondary'
> = {
  active: 'success',
  pending: 'warning',
  suspended: 'destructive',
  deactivated: 'secondary',
}

const STATUS_OPTIONS: { value: UserStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'deactivated', label: 'Deactivated' },
]

const ROLE_OPTIONS: { value: UserRole | ''; label: string }[] = [
  { value: '', label: 'All roles' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
]

export function AdminUsersView() {
  const { toast } = useToast()
  const [data, setData] = React.useState<PaginatedUsers | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState('')
  const [status, setStatus] = React.useState<UserStatus | ''>('')
  const [role, setRole] = React.useState<UserRole | ''>('')
  const [pendingId, setPendingId] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await userService.listUsers({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: status || undefined,
        role: role || undefined,
      })
      setData(result)
    } catch (error) {
      toast({
        title: 'Failed to load users',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, search, status, role, toast])

  React.useEffect(() => {
    load()
  }, [load])

  function updateLocal(user: UserProfile) {
    setData((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((u) => (u.userId === user.userId ? user : u)),
          }
        : prev
    )
  }

  async function onChangeStatus(user: UserProfile, next: UserStatus) {
    setPendingId(user.userId)
    try {
      const updated = await userService.updateUserStatus(user.userId, next)
      updateLocal(updated)
      toast({ title: `Status set to ${next}` })
    } catch (error) {
      toast({
        title: 'Status update failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setPendingId(null)
    }
  }

  async function onChangeRole(user: UserProfile, next: UserRole) {
    setPendingId(user.userId)
    try {
      const updated = await userService.updateUserRole(user.userId, next)
      updateLocal(updated)
      toast({ title: `Role set to ${next}` })
    } catch (error) {
      toast({
        title: 'Role update failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setPendingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Manage member accounts, roles, and statuses.
        </CardDescription>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by name, username, or email…"
              value={search}
              onValueChange={setSearch}
              onDebouncedChange={(value) => {
                setPage(1)
                setSearch(value)
              }}
            />
          </div>
          <Select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => {
              setPage(1)
              setStatus(e as UserStatus | '')
            }}
            className="sm:w-44"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Filter by role"
            value={role}
            onChange={(e) => {
              setPage(1)
              setRole(e as UserRole | '')
            }}
            className="sm:w-36"
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No users found.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            size="sm"
                            src={user.avatar}
                            name={user.fullName ?? user.username}
                          />
                          <div>
                            <p className="font-medium">
                              {user.fullName ?? user.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={STATUS_VARIANT[user.status]}
                          className="capitalize"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Select
                            aria-label="Change role"
                            value={user.role}
                            disabled={pendingId === user.userId}
                            onChange={(e) =>
                              onChangeRole(user, e as UserRole)
                            }
                            className="h-8 w-28"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </Select>
                          {user.status === 'suspended' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              isLoading={pendingId === user.userId}
                              onClick={() => onChangeStatus(user, 'active')}
                            >
                              Activate
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              isLoading={pendingId === user.userId}
                              onClick={() => onChangeStatus(user, 'suspended')}
                            >
                              Suspend
                            </Button>
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
                {data.total} user{data.total === 1 ? '' : 's'}
              </p>
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
