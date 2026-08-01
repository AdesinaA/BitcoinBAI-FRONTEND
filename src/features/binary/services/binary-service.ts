import { apiClient } from '@/lib/api-client'
import type { ApiSuccess, BinaryStatistics, BinaryTree } from '../types'

/**
 * Binary service — thin wrappers around the backend Binary module endpoints.
 */

export async function getTree(userId?: string): Promise<BinaryTree> {
  const { data } = await apiClient.get<ApiSuccess<BinaryTree>>('/binary/tree', {
    params: userId ? { userId } : undefined,
  })
  return data.data
}

export async function getStatistics(): Promise<BinaryStatistics> {
  const { data } = await apiClient.get<ApiSuccess<BinaryStatistics>>(
    '/binary/statistics'
  )
  return data.data
}

export interface ActivationResult {
  activated: boolean
  binaryRootCreated: boolean
  message: string
}

/**
 * Activate the authenticated user's account: verifies the required deposit,
 * transitions the account to active, and creates the binary root node.
 */
export async function activate(): Promise<ActivationResult> {
  const { data } = await apiClient.post<ApiSuccess<ActivationResult>>(
    '/binary/activate'
  )
  return data.data
}
