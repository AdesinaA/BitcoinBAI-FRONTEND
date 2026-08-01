/**
 * Referral feature API types — mirror the backend Referral module contract.
 */

export type ReferralStatus = 'pending' | 'active' | 'rewarded'
export type RewardStatus = 'pending' | 'paid'

export interface ReferralLink {
  referralCode: string
  referralLink: string
}

export interface ReferralStatistics {
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  pendingRewards: number
}

export interface ReferralItem {
  referralId: string
  referredId: string
  username: string
  fullName?: string
  status: ReferralStatus
  rewardAmount: number
  rewardStatus: RewardStatus
  createdAt?: string
  rewardedAt?: string | null
}

export interface ReferralHistory {
  referrals: ReferralItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
}
