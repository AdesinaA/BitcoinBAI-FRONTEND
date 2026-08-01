'use client'

import * as React from 'react'
import { ArrowLeft, ArrowRight, Layers, Loader2, TrendingUp, Users } from 'lucide-react'

import {
  getApiErrorMessage,
  isNotInBinaryNetworkError,
} from '@/features/auth/utils/api-error'
import { StatCard } from '@/components/cards/stat-card'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import * as binaryService from '../services/binary-service'
import { BinaryTreeView } from './binary-tree'
import type { BinaryStatistics, BinaryTree } from '../types'

function formatBtc(amount: number): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}

export function BinaryDashboard() {
  const { toast } = useToast()
  const [stats, setStats] = React.useState<BinaryStatistics | null>(null)
  const [tree, setTree] = React.useState<BinaryTree | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isActivating, setIsActivating] = React.useState(false)
  const [refreshTrigger, setRefreshTrigger] = React.useState(0)

  React.useEffect(() => {
    setIsLoading(true)
    let cancelled = false
    async function load() {
      const results = await Promise.allSettled([
        binaryService.getStatistics(),
        binaryService.getTree(),
      ])
      if (cancelled) return

      // "User not in binary network" is an expected state for users who
      // haven't been placed in the binary tree yet — don't surface it as a
      // destructive error toast. Only toast for genuinely unexpected failures.
      let unexpectedError: unknown = null

      if (results[0].status === 'fulfilled') {
        setStats(results[0].value)
      } else if (!isNotInBinaryNetworkError(results[0].reason)) {
        unexpectedError = results[0].reason
      }

      if (results[1].status === 'fulfilled') {
        setTree(results[1].value)
      } else if (!isNotInBinaryNetworkError(results[1].reason)) {
        unexpectedError = unexpectedError ?? results[1].reason
      }

      if (unexpectedError && !cancelled) {
        toast({
          title: 'Failed to load binary network',
          description: getApiErrorMessage(unexpectedError, 'Something went wrong'),
          variant: 'destructive',
        })
      }

      if (!cancelled) setIsLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [toast, refreshTrigger])

  async function handleActivate() {
    setIsActivating(true)
    try {
      const result = await binaryService.activate()
      toast({
        variant: 'success',
        title: 'Account activated',
        description: result.message,
      })
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      toast({
        title: 'Activation failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsActivating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[480px] rounded-lg" />
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="font-medium">{"You're not in the binary network yet"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Activate your account to join the binary network and start building
            your team.
          </p>
          <Button
            className="mt-4"
            onClick={handleActivate}
            disabled={isActivating}
          >
            {isActivating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Activating...
              </>
            ) : (
              'Activate Account'
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current level"
          value={String(stats.currentLevel)}
          icon={Layers}
          description={`${stats.progress}% to level ${stats.currentLevel + 1}`}
        />
        <StatCard
          title="Left team"
          value={String(stats.leftTeamCount)}
          icon={ArrowLeft}
          description={`${formatBtc(stats.leftTeamVolume)} BTC`}
        />
        <StatCard
          title="Right team"
          value={String(stats.rightTeamCount)}
          icon={ArrowRight}
          description={`${formatBtc(stats.rightTeamVolume)} BTC`}
        />
        <StatCard
          title="Total members"
          value={String(stats.leftTeamCount + stats.rightTeamCount)}
          icon={Users}
          description={`Weaker leg: ${stats.weakerLeg}`}
        />
        <StatCard
          title="Current chain level"
          value={
            stats.currentChainLevel >= 0
              ? `Level ${stats.currentChainLevel}`
              : '—'
          }
          icon={Layers}
          description={
            stats.currentChainLevel >= 0
              ? `$${Math.pow(2, stats.currentChainLevel) * 7} earned`
              : 'Build your referral chain'
          }
        />
      </div>

      {/* Level progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-gold" />
            Progress to level {stats.currentLevel + 1}
          </CardTitle>
          <CardDescription>
            Build both legs to {formatBtc(stats.nextLevelRequirement)} BTC to advance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${stats.progress}%` }}
                role="progressbar"
                aria-valuenow={stats.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats.progress}%</span>
              <span>
                {formatBtc(Math.min(stats.leftTeamVolume, stats.rightTeamVolume))} /{' '}
                {formatBtc(stats.nextLevelRequirement)} BTC
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chain level progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-gold" />
            Chain level progress
          </CardTitle>
          <CardDescription>
            {stats.totalReferrals} / {stats.nextChainLevelThreshold} referrals to reach the next chain level.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${stats.nextChainLevelProgress}%` }}
                role="progressbar"
                aria-valuenow={stats.nextChainLevelProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats.nextChainLevelProgress}%</span>
              <span>
                {stats.totalReferrals} / {stats.nextChainLevelThreshold} referrals
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Your network</CardTitle>
          <CardDescription>
            Left (gold) and right placements in your binary tree.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tree ? (
            <BinaryTreeView tree={tree} />
          ) : (
            <Skeleton className="h-[480px] rounded-lg" />
          )}
        </CardContent>
      </Card>

      {/* Chain level rewards */}
      <Card>
        <CardHeader>
          <CardTitle>Chain level rewards</CardTitle>
          <CardDescription>
            Your referral chain: each level doubles the required referrals and the reward.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Referrals required</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.chainLevels.map((cl) => (
                  <TableRow key={cl.level}>
                    <TableCell className="font-medium">{cl.level}</TableCell>
                    <TableCell>{cl.threshold}</TableCell>
                    <TableCell>${cl.payoutUsd}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cl.paid
                            ? 'default'
                            : cl.reached
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {cl.paid ? 'Paid' : cl.reached ? 'Reached' : 'Pending'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
