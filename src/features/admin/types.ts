/* ------------------------------------------------------------------ */
/* Shared wrappers (mirrors shared/src/responses/response.wrappers.ts) */
/* ------------------------------------------------------------------ */

export interface ApiSuccess<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/* ------------------------------------------------------------------ */
/* Admin metrics / statistics / health                                */
/* ------------------------------------------------------------------ */

export interface AdminMetrics {
  totalUsers: number
  totalWallets: number
  totalBitcoinNodes: number
  totalPools: number
  totalCommissions: number
}

export interface AdminStatistics {
  totalDeposited: number
  totalWithdrawn: number
  totalPoolInvestments: number
  totalReferralRewards: number
  totalCommissionRewards: number
}

export interface AdminHealth {
  status: 'ok' | 'degraded' | 'down'
  timestamp: string
  uptime: number
  services: Array<{
    name: string
    status: 'ok' | 'degraded' | 'down'
  }>
}

/* ------------------------------------------------------------------ */
/* Wallet overview + withdrawal queue                                 */
/* ------------------------------------------------------------------ */

export interface WalletOverview {
  totalBalance: number
  totalPendingBalance: number
  totalDeposited: number
  totalWithdrawn: number
}

export interface WalletsOverview {
  wallets: WalletOverview
  recentWithdrawals: AdminWithdrawalItem[]
}

export interface CreditWalletPayload {
  email: string
  amount: number
  description?: string
}

export interface CreditWalletResult {
  userId: string
  userEmail?: string | null
  userName?: string | null
  walletId: string
  bitcoinAddress: string
  balance: number
  totalDeposited: number
  amountCredited: number
  transactionId: string
}

export type WithdrawalStatus =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'

export interface AdminWithdrawalItem {
  withdrawalId: string
  userId: string
  userName?: string | null
  userEmail?: string | null
  amount: number
  bitcoinAddress: string
  status: WithdrawalStatus
  createdAt?: string
  updatedAt?: string
  processedBy?: string | null
  processedAt?: string | null
  rejectionReason?: string | null
}

export interface PaginatedWithdrawals {
  items: AdminWithdrawalItem[]
  withdrawals: AdminWithdrawalItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ListWithdrawalsParams {
  page?: number
  limit?: number
  status?: WithdrawalStatus
}

/* ------------------------------------------------------------------ */
/* Audit logs                                                         */
/* ------------------------------------------------------------------ */

export interface AuditLogItem {
  auditLogId: string
  action: string
  actorId?: string | null
  actorLabel?: string | null
  targetType?: string | null
  targetId?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  metadata?: Record<string, unknown> | null
  createdAt?: string
}

export interface PaginatedAuditLogs {
  items: AuditLogItem[]
  logs: AuditLogItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ListAuditLogsParams {
  page?: number
  limit?: number
  action?: string
  targetType?: string
}

/* ------------------------------------------------------------------ */
/* Settings                                                           */
/* ------------------------------------------------------------------ */

export type SettingCategory =
  | 'binary'
  | 'referral'
  | 'commission'
  | 'pool'
  | 'withdrawal'
  | 'platform'

export interface SettingItem {
  settingId: string
  category: SettingCategory
  key: string
  value: unknown
  isActive: boolean
  description?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface UpdateSettingPayload {
  value?: unknown
  isActive?: boolean
}