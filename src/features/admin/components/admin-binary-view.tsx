'use client'

import * as React from 'react'
import {
  ChevronRight,
  Loader2,
  MousePointerClick,
  Network,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react'

import {
  getApiErrorMessage,
  isNotInBinaryNetworkError,
} from '@/features/auth/utils/api-error'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import * as adminService from '@/features/admin/services/admin-service'
import type { AdminUserItem } from '@/features/admin/types'
import * as binaryService from '@/features/binary/services/binary-service'
import { BinaryTreeView } from '@/features/binary/components/binary-tree'
import type { BinaryStatistics, BinaryTree, BinaryTreeNode } from '@/features/binary/types'

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatBtc(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
}

interface TrailEntry {
  userId: string
  username: string
}

/* ------------------------------------------------------------------ */
/* User search selector                                                */
/* ------------------------------------------------------------------ */

interface UserSearchSelectProps {
  onSelect: (user: AdminUserItem) => void
}

function UserSearchSelect({ onSelect }: UserSearchSelectProps) {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<AdminUserItem[]>([])
  const [open, setOpen] = React.useState(false)
  const [searching, setSearching] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Debounced search against the admin user list endpoint.
  React.useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const page = await adminService.listUsers({ search: trimmed, limit: 8 })
        setResults(page.items)
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Close the dropdown when clicking outside.
  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const showDropdown = open && query.trim().length >= 2

  return (
    <div ref={containerRef} className="relative w-full md:w-80">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (results.length > 0 && query.trim().length >= 2) setOpen(true)
          }}
          placeholder="Search member by name, username or email"
          className="pl-9"
          aria-label="Search members"
        />
        {searching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-md border border-border bg-popover shadow-md">
          {results.length === 0 && !searching ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              No members found
            </p>
          ) : (
            <ul className="max-h-64 overflow-y-auto py-1">
              {results.map((user) => (
                <li key={user.userId}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-accent"
                    onClick={() => {
                      onSelect(user)
                      setQuery('')
                      setResults([])
                      setOpen(false)
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {user.username}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                      {user.status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export function AdminBinaryView() {
  const { toast } = useToast()
  const [stats, setStats] = React.useState<BinaryStatistics | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Tree explorer state.
  const [tree, setTree] = React.useState<BinaryTree | null>(null)
  const [treeLoading, setTreeLoading] = React.useState(true)
  const [treeError, setTreeError] = React.useState<'not_in_network' | 'error' | null>(null)
  const [trail, setTrail] = React.useState<TrailEntry[]>([])

  /** Load a user's subtree (own tree when userId is omitted). */
  const loadTree = React.useCallback(
    async (userId?: string, label?: string) => {
      setTreeLoading(true)
      setTreeError(null)
      try {
        const data = await binaryService.getTree(userId)
        setTree(data)
        setTrail((prev) => {
          const entry: TrailEntry = {
            userId: data.root.userId,
            username: label ?? data.root.username,
          }
          // Replace the tail when re-loading the same user (e.g. via search).
          if (prev.length > 0 && prev[prev.length - 1].userId === data.root.userId) {
            return [...prev.slice(0, -1), entry]
          }
          return [...prev, entry]
        })
      } catch (error) {
        setTree(null)
        if (isNotInBinaryNetworkError(error)) {
          setTreeError('not_in_network')
        } else {
          setTreeError('error')
          toast({
            title: 'Failed to load binary tree',
            description: getApiErrorMessage(error),
            variant: 'destructive',
          })
        }
      } finally {
        setTreeLoading(false)
      }
    },
    [toast]
  )

  // Initial load: platform statistics for the admin + their own tree.
  React.useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await binaryService.getStatistics()
        setStats(data)
      } catch (error) {
        if (!isNotInBinaryNetworkError(error)) {
          toast({
            title: 'Failed to load binary statistics',
            description: getApiErrorMessage(error),
            variant: 'destructive',
          })
        }
      } finally {
        setIsLoading(false)
      }
      await loadTree()
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Drill into a downline member's subtree. */
  function handleNodeClick(node: BinaryTreeNode) {
    void loadTree(node.userId, node.username)
  }

  /** Jump back to an earlier point in the navigation trail. */
  function handleTrailClick(index: number) {
    const entry = trail[index]
    if (!entry) return
    setTrail(trail.slice(0, index))
    void loadTree(entry.userId, entry.username)
  }

  /** Pick a user from the search selector. */
  function handleSelectUser(user: AdminUserItem) {
    setTrail([])
    void loadTree(user.userId, user.username)
  }

  const root = tree?.root

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">Binary Network</h1>
        <p className="text-sm text-muted-foreground">
          Overview of the binary tree structure and network metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Left Team
            </CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-numeric text-2xl font-semibold tracking-[-0.03em] text-text-primary">
              {stats?.leftTeamCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Volume: {formatBtc(stats?.leftTeamVolume ?? 0)} BTC
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Right Team
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-numeric text-2xl font-semibold tracking-[-0.03em] text-text-primary">
              {stats?.rightTeamCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Volume: {formatBtc(stats?.rightTeamVolume ?? 0)} BTC
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-numeric text-2xl font-semibold tracking-[-0.03em] text-text-primary">
              {stats?.totalEarnings ?? 0} BTC
            </div>
            <p className="text-xs text-muted-foreground">
              Weaker leg: {stats?.weakerLeg ?? 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed binary tree explorer */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>Binary Tree</CardTitle>
              <CardDescription>
                Inspect the network of any member. Click a node card to
                drill into that subtree.
              </CardDescription>
            </div>
            <UserSearchSelect onSelect={handleSelectUser} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Navigation trail */}
          {trail.length > 0 && (
            <nav
              aria-label="Binary tree navigation"
              className="flex flex-wrap items-center gap-1 text-sm"
            >
              {trail.map((entry, index) => {
                const isLast = index === trail.length - 1
                return (
                  <React.Fragment key={`${entry.userId}-${index}`}>
                    {index > 0 && (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                    {isLast ? (
                      <span className="rounded-md bg-gold/10 px-2 py-1 font-medium text-gold">
                        {entry.username}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleTrailClick(index)}
                        className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {entry.username}
                      </button>
                    )}
                  </React.Fragment>
                )
              })}
            </nav>
          )}

          {/* Subtree summary for the currently viewed root */}
          {root && !treeLoading && !treeError && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border/60 p-3">
                <p className="text-xs text-muted-foreground">Viewing member</p>
                <p className="truncate text-sm font-semibold text-text-primary">
                  {root.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  Level {root.level}
                  {root.position ? ` · placed ${root.position}` : ' · root'}
                </p>
              </div>
              <div className="rounded-lg border border-gold/30 bg-gold/5 p-3">
                <p className="text-xs text-muted-foreground">Left team</p>
                <p className="text-sm font-semibold text-text-primary">
                  {root.leftTeamCount} member{root.leftTeamCount !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBtc(root.leftTeamVolume)} BTC
                </p>
              </div>
              <div className="rounded-lg border border-border/60 p-3">
                <p className="text-xs text-muted-foreground">Right team</p>
                <p className="text-sm font-semibold text-text-primary">
                  {root.rightTeamCount} member{root.rightTeamCount !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBtc(root.rightTeamVolume)} BTC
                </p>
              </div>
              <div className="rounded-lg border border-border/60 p-3">
                <p className="text-xs text-muted-foreground">Total downline</p>
                <p className="text-sm font-semibold text-text-primary">
                  {root.leftTeamCount + root.rightTeamCount} member
                  {root.leftTeamCount + root.rightTeamCount !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  Shown up to 4 levels deep
                </p>
              </div>
            </div>
          )}

          {/* Tree canvas / states */}
          {treeLoading ? (
            <Skeleton className="h-[520px] rounded-lg" />
          ) : treeError === 'not_in_network' ? (
            <div className="flex h-[320px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center">
              <Network className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">
                This member has not joined the binary network yet
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Search for another member above to inspect their tree.
              </p>
            </div>
          ) : treeError === 'error' ? (
            <div className="flex h-[320px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center">
              <p className="text-sm font-medium">Unable to load the tree</p>
              <p className="text-sm text-muted-foreground">
                Try again or search for another member.
              </p>
            </div>
          ) : tree ? (
            <>
              <BinaryTreeView
                tree={tree}
                detailed
                height={520}
                onNodeClick={handleNodeClick}
                emptyState={
                  <div className="flex h-[320px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center">
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {root ? `${root.username} has no downline yet` : 'No downline yet'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Members placed under this user will appear here.
                    </p>
                  </div>
                }
              />
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-gold" />
                  Gold node / edge: left placement
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground" />
                  Grey edge: right placement
                </span>
                <span className="flex items-center gap-1.5">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  Click a member card to open their subtree
                </span>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}