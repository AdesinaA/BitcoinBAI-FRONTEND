'use client'

import * as React from 'react'
import { Bell, Check, Loader2, Mail } from 'lucide-react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import * as notificationService from '../services/notification-service'
import type {
  Notification,
  NotificationHistory,
  NotificationPreferences,
} from '../types'

const PAGE_SIZE = 20

function statusVariant(status: string) {
  if (status === 'unread') return 'default' as const
  if (status === 'sent' || status === 'read') return 'secondary' as const
  return 'outline' as const
}

function priorityVariant(priority: string) {
  if (priority === 'high') return 'destructive' as const
  if (priority === 'medium') return 'default' as const
  return 'secondary' as const
}

function formatTime(date: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function NotificationCenter() {
  const { toast } = useToast()
  const [history, setHistory] = React.useState<NotificationHistory | null>(
    null
  )
  const [preferences, setPreferences] = React.useState<
    NotificationPreferences | null
  >(null)
  const [page, setPage] = React.useState(1)
  const [activeTab, setActiveTab] = React.useState('all')
  const [isLoading, setIsLoading] = React.useState(true)
  const [isMarking, setIsMarking] = React.useState(false)

  const load = React.useCallback(async () => {
    try {
      const [h, p] = await Promise.all([
        notificationService.getNotifications(
          page,
          PAGE_SIZE,
          activeTab === 'unread' ? 'unread' : undefined
        ),
        notificationService.getPreferences(),
      ])
      setHistory(h)
      setPreferences(p)
    } catch (error) {
      toast({
        title: 'Failed to load notifications',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, activeTab, toast])

  React.useEffect(() => {
    setIsLoading(true)
    load()
  }, [load])

  async function handleMarkAllRead() {
    setIsMarking(true)
    try {
      await notificationService.markAllRead()
      toast({ title: 'All notifications marked as read' })
      load()
    } catch (error) {
      toast({
        title: 'Failed to mark all read',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsMarking(false)
    }
  }

  async function handleMarkRead(notification: Notification) {
    if (notification.status !== 'unread') return
    try {
      await notificationService.markRead(notification.notificationId)
      load()
    } catch (error) {
      toast({
        title: 'Failed to mark as read',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    }
  }

  async function handlePreferenceChange(
    key: keyof NotificationPreferences,
    value: boolean
  ) {
    if (!preferences) return
    try {
      const updated = await notificationService.updatePreferences({
        [key]: value,
      })
      setPreferences(updated)
      toast({ title: 'Preference updated' })
    } catch (error) {
      toast({
        title: 'Failed to update preference',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    }
  }

  const unreadCount = history?.unreadCount ?? 0

  if (isLoading && !history) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">Notifications</h1>
          {unreadCount > 0 ? (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} unread
            </Badge>
          ) : null}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          disabled={isMarking || unreadCount === 0}
        >
          {isMarking ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          {isMarking ? 'Marking...' : 'Mark all read'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {!history || history.notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You have no notifications at this time."
            />
          ) : (
            <>
              <Card>
                <CardContent className="pt-0">
                  <div className="rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.notifications.map((n) => (
                          <TableRow
                            key={n.notificationId}
                            className={
                              n.status === 'unread' ? 'bg-muted/30' : ''
                            }
                          >
                            <TableCell>
                              {n.type === 'email' ? (
                                <Mail className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Bell className="h-4 w-4 text-accent" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {n.title}
                            </TableCell>
                            <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                              {n.message}
                            </TableCell>
                            <TableCell>
                              <Badge variant={priorityVariant(n.priority)}>
                                {n.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusVariant(n.status)}>
                                {n.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatTime(n.createdAt)}
                            </TableCell>
                            <TableCell>
                              {n.status === 'unread' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkRead(n)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              ) : null}
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
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="unread">
          {!history || history.notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No unread notifications"
              description="You are all caught up!"
            />
          ) : (
            <Card>
              <CardContent className="pt-0">
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.notifications.map((n) => (
                        <TableRow key={n.notificationId}>
                          <TableCell className="font-medium">
                            {n.title}
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                            {n.message}
                          </TableCell>
                          <TableCell>
                            <Badge variant={priorityVariant(n.priority)}>
                              {n.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatTime(n.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkRead(n)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preferences">
          {preferences ? (
            <Card>
              <CardHeader>
                <CardTitle>Notification preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.email}
                    onCheckedChange={(v) =>
                      handlePreferenceChange('email', v)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">In-app notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Show notifications in the app.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.inApp}
                    onCheckedChange={(v) =>
                      handlePreferenceChange('inApp', v)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Critical system alerts.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.system}
                    onCheckedChange={(v) =>
                      handlePreferenceChange('system', v)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing emails</p>
                    <p className="text-sm text-muted-foreground">
                      Promotional offers and updates.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(v) =>
                      handlePreferenceChange('marketing', v)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Skeleton className="h-64 rounded-lg" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
