import { apiClient } from '@/lib/api-client'
import type {
  ApiSuccess,
  CommissionHistory,
  CommissionStatistics,
  ProcessResult,
  RewardConfig,
} from '../types'

/** Commission service — thin wrappers around the backend Commission endpoints. */

export async function getHistory(
  page = 1,
  limit = 20,
  type?: string
): Promise<CommissionHistory> {
  const { data } = await apiClient.get<ApiSuccess<CommissionHistory>>(
    '/commissions/history',
    { params: { page, limit, type } }
  )
  return data.data
}

export async function getStatistics(): Promise<CommissionStatistics> {
  const { data } = await apiClient.get<ApiSuccess<CommissionStatistics>>(
    '/commissions/statistics'
  )
  return data.data
}

export async function getConfig(): Promise<RewardConfig> {
  const { data } = await apiClient.get<ApiSuccess<RewardConfig>>(
    '/commissions/config'
  )
  return data.data
}

export async function processAll(): Promise<ProcessResult> {
  const { data } = await apiClient.post<ApiSuccess<ProcessResult>>(
    '/commissions/process'
  )
  return data.data
}
