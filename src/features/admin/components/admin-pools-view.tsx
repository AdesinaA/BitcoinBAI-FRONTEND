'use client'

import * as React from 'react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import * as poolService from '@/features/pool/services/pool-service'
import type { Pool, PoolReport } from '@/features/pool/types'

export function AdminPoolsView() {
  const { toast } = useToast()
  const [pools, setPools] = React.useState<Pool[]>([])
  const [reports, setReports] = React.useState<PoolReport[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDistributing, setIsDistributing] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const [poolsData, reportsData] = await Promise.all([
          poolService.getPools(),
          poolService.getReports(),
        ])
        setPools(poolsData)
        setReports(reportsData)
      } catch (error) {
        toast({
          title: 'Failed to load pool data',
          description: getApiErrorMessage(error),
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [toast])

  async function handleDistribute(poolId: string) {
    setIsDistributing(poolId)
    try {
      await poolService.distribute(poolId)
      toast({ title: 'Returns distributed successfully' })
    } catch (error) {
      toast({
        title: 'Distribution failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsDistributing(null)
    }
  }

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
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">Investment Pools</h1>
        <p className="text-sm text-muted-foreground">
          Manage pool programs, investments, and quarterly distributions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pool Programs</CardTitle>
          <CardDescription>
            Active and completed investment pool programs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pools || pools.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No pools found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Return Rate</TableHead>
                    <TableHead>Invested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pools.map((pool) => (
                    <TableRow key={pool.poolId}>
                      <TableCell className="font-medium">
                        {pool.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            pool.status === 'active'
                              ? 'success'
                              : pool.status === 'completed'
                              ? 'secondary'
                              : 'warning'
                          }
                          className="capitalize"
                        >
                          {pool.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{pool.returnRate}%</TableCell>
                      <TableCell>{pool.totalInvested} BTC</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          isLoading={isDistributing === pool.poolId}
                          onClick={() => handleDistribute(pool.poolId)}
                          disabled={pool.status !== 'active'}
                        >
                          Distribute
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pool Reports</CardTitle>
          <CardDescription>
            Distribution reports and ROI metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!reports || reports.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No reports found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool</TableHead>
                    <TableHead>Total Returns</TableHead>
                    <TableHead>Investors</TableHead>
                    <TableHead>ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.poolId}>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>{report.totalReturns} BTC</TableCell>
                      <TableCell>{report.investorCount}</TableCell>
                      <TableCell>{report.roi}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
