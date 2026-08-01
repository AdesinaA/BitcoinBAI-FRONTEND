import { apiClient } from '@/lib/api-client'
import type {
  ApiSuccess,
  DistributeResult,
  InvestmentHistory,
  InvestResult,
  Pool,
  PoolReport,
} from '../types'

/** Pool service — thin wrappers around the backend Pool endpoints. */

export async function getPools(status?: string): Promise<Pool[]> {
  const { data } = await apiClient.get<ApiSuccess<Pool[]>>('/pools', {
    params: status ? { status } : undefined,
  })
  return data.data
}

export async function getPool(poolId: string): Promise<Pool> {
  const { data } = await apiClient.get<ApiSuccess<Pool>>(`/pools/${poolId}`)
  return data.data
}

export async function invest(
  poolId: string,
  amountSatoshis: number
): Promise<InvestResult> {
  const { data } = await apiClient.post<ApiSuccess<InvestResult>>(
    '/pools/invest',
    { poolId, amount: amountSatoshis }
  )
  return data.data
}

export async function getInvestments(
  page = 1,
  limit = 20
): Promise<InvestmentHistory> {
  const { data } = await apiClient.get<ApiSuccess<InvestmentHistory>>(
    '/pools/investments',
    { params: { page, limit } }
  )
  return data.data
}

export async function getReports(): Promise<PoolReport[]> {
  const { data } = await apiClient.get<ApiSuccess<PoolReport[]>>(
    '/pools/reports'
  )
  return data.data
}

export async function distribute(
  poolId: string
): Promise<DistributeResult> {
  const { data } = await apiClient.post<ApiSuccess<DistributeResult>>(
    `/pools/${poolId}/distribute`
  )
  return data.data
}
