/**
 * Pool feature API types — mirror the backend Pool module.
 */

export type PoolStatus = 'active' | 'inactive' | 'completed'
export type InvestmentStatus = 'active' | 'completed' | 'cancelled'

export interface Pool {
  poolId: string
  name: string
  description: string | null
  minInvestment: number
  maxInvestment: number
  priceUsd?: number
  returnRate: number
  duration: number
  status: PoolStatus
  totalInvested: number
  totalReturns: number
  startDate: string | null
  endDate: string | null
  createdAt: string
}

export interface Investment {
  investmentId: string
  poolId: string
  poolName: string
  amount: number
  expectedReturn: number
  actualReturn: number
  returnRate: number
  duration: number
  status: InvestmentStatus
  startDate: string | null
  endDate: string | null
  returnDate: string | null
}

export interface InvestmentHistory {
  investments: Investment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PoolReport {
  poolId: string
  name: string
  status: PoolStatus
  returnRate: number
  duration: number
  totalInvested: number
  totalReturns: number
  investorCount: number
  roi: number
}

export interface InvestResult {
  investmentId: string
  poolId: string
  poolName: string
  amount: number
  expectedReturn: number
  startDate: string
  endDate: string
  status: InvestmentStatus
}

export interface DistributeResult {
  poolName: string
  processed: number
  totalDistributed: number
}

export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
}
