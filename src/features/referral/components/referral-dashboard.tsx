'use client'

import * as React from 'react'
import {
  Check,
  Coins,
  Copy,
  Gift,
  Share2,
  UserCheck,
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
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
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
import * as referralService from '../services/referral-service'
import type {
  ReferralHistory,
  ReferralLink,
  ReferralStatistics,
} from '../types'

const PAGE_SIZE = 8

function formatBtc(amount: number): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}

function statusVariant(status: string) {
  if (status === 'rewarded' || status === 'paid') return 'default' as const
  if (status === 'active') return 'secondary' as const
  return 'outline' as const
}

export function ReferralDashboard() {
  const { toast } = useToast()
  const [link, setLink] = React.useState<ReferralLink | null>(null)
  const [stats, setStats] = React.useState<ReferralStatistics | null>(null)
  const [history, setHistory] = React.useState<ReferralHistory | null>(null)
  const [page, setPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(true)
  const [copied, setCopied] = React.useState<'code' | 'link' | null>(null)

  const load = React.useCallback(
    async (p: number) => {
      try {
        const [l, s, h] = await Promise.all([
          referralService.getReferralLink(),
          referralService.getStatistics(),
          referralService.getHistory(p, PAGE_SIZE),
        ])
        setLink(l)
        setStats(s)
        setHistory(h)
      } catch (error) {
        toast({
          title: 'Failed to load referrals',
          description: getApiErrorMessage(error),
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast]
  )

  React.useEffect(() => {
    setIsLoading(true)
    load(page)
  }, [load, page])

  async function copyText(text: string, which: 'code' | 'link') {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      toast({ title: 'Copied to clipboard' })
      setTimeout(() => setCopied(null), 1500)
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' })
    }
  }

  async function share() {
    if (!link) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Bitcoin BAI',
          text: `Sign up with my referral code ${link.referralCode}`,
          url: link.referralLink,
        })
      } catch {
        /* user cancelled */
      }
    } else {
      copyText(link.referralLink, 'link')
    }
  }

  if (isLoading && !stats) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-lg" />
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
      {/* Referral link */}
      <Card className="border-gold/20 bg-gradient-to-br from-card to-gold/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-gold" />
            Your referral link
          </CardTitle>
          <CardDescription>
            Share your link or code — earn rewards when people join through you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input readOnly value={link?.referralLink ?? ''} className="flex-1" />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => link && copyText(link.referralLink, 'link')}
              >
                {copied === 'link' ? (
                  <Check className="mr-2 h-4 w-4 text-success" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                Copy link
              </Button>
              <Button onClick={share} variant="gold">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Code:</span>
            <button
              type="button"
              onClick={() => link && copyText(link.referralCode, 'code')}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1 font-mono text-sm font-semibold transition-colors hover:bg-muted"
            >
              {link?.referralCode}
              {copied === 'code' ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total referrals"
          value={String(stats?.totalReferrals ?? 0)}
          icon={Users}
        />
        <StatCard
          title="Active referrals"
          value={String(stats?.activeReferrals ?? 0)}
          icon={UserCheck}
        />
        <StatCard
          title="Total earnings"
          value={`${formatBtc(stats?.totalEarnings ?? 0)} BTC`}
          icon={Coins}
        />
        <StatCard
          title="Pending rewards"
          value={`${formatBtc(stats?.pendingRewards ?? 0)} BTC`}
          icon={Gift}
        />
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral history</CardTitle>
          <CardDescription>
            People who joined using your referral code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!history || history.referrals.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No referrals yet"
              description="Share your referral link to start building your team and earning rewards."
            />
          ) : (
            <>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Reward status</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.referrals.map((r) => (
                      <TableRow key={r.referralId}>
                        <TableCell>
                          <div className="font-medium">{r.username}</div>
                          {r.fullName ? (
                            <div className="text-xs text-muted-foreground">
                              {r.fullName}
                            </div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatBtc(r.rewardAmount)} BTC
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(r.rewardStatus)}>
                            {r.rewardStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString()
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
