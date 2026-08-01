import { apiClient } from '@/lib/api-client'
import type {
  ApiSuccess,
  ReferralHistory,
  ReferralLink,
  ReferralStatistics,
} from '../types'

/** Referral service — thin wrappers around the backend Referral endpoints. */

export async function getReferralLink(): Promise<ReferralLink> {
  const { data } = await apiClient.get<ApiSuccess<ReferralLink>>(
    '/referrals/link'
  )
  return data.data
}

export async function getStatistics(): Promise<ReferralStatistics> {
  const { data } = await apiClient.get<ApiSuccess<ReferralStatistics>>(
    '/referrals/statistics'
  )
  return data.data
}

export async function getHistory(
  page = 1,
  limit = 10
): Promise<ReferralHistory> {
  const { data } = await apiClient.get<ApiSuccess<ReferralHistory>>(
    '/referrals/history',
    { params: { page, limit } }
  )
  return data.data
}
