/**
 * Commission feature API types — mirror the backend Commission module.
 */

export type CommissionType = 'binary' | 'referral' | 'level_reward' | 'pool_return'
export type CommissionStatus = 'pending' | 'credited' | 'paid' | 'failed' | 'cancelled'

export interface CommissionItem {
  commissionId: string
  type: CommissionType
  amount: number
  level: number | null
  status: CommissionStatus
  description: string | null
  createdAt?: string
  paidAt?: string | null
}

export interface CommissionHistory {
  commissions: CommissionItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CommissionStatistics {
  totalEarnings: number
  byType: Record<string, number>
  count: number
}

export interface RewardConfig {
  binaryMatchPercent: number
  referralRewardAmount: number
  levelRewards: number[]
  minMatchVolume: number
}

export interface ProcessResult {
  binary: { processed: number; totalPaid: number }
  levels: { processed: number; totalPaid: number }
  referrals: { processed: number; totalPaid: number }
}

export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
}
