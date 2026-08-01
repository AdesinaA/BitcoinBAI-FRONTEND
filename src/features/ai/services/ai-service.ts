import { apiClient } from '@/lib/api-client'
import type {
  AiChatResponse,
  AiHistory,
  AiUsage,
  AiLimits,
  ApiSuccess,
} from '../types'

/**
 * AI Assistant service — thin wrappers around the backend AI module endpoints.
 */

export async function chat(query: string): Promise<AiChatResponse> {
  const { data } = await apiClient.post<ApiSuccess<AiChatResponse>>(
    '/ai/chat',
    { query }
  )
  return data.data
}

export async function getHistory(
  page = 1,
  limit = 20,
  status?: string
): Promise<AiHistory> {
  const { data } = await apiClient.get<ApiSuccess<AiHistory>>('/ai/history', {
    params: { page, limit, status },
  })
  return data.data
}

export async function getUsage(
  startDate?: string,
  endDate?: string
): Promise<AiUsage> {
  const { data } = await apiClient.get<ApiSuccess<AiUsage>>('/ai/usage', {
    params: { startDate, endDate },
  })
  return data.data
}

export async function getLimits(): Promise<AiLimits> {
  const { data } = await apiClient.get<ApiSuccess<AiLimits>>('/ai/limits')
  return data.data
}
