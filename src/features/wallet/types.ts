/**
 * Wallet feature API types — mirror the backend Wallet module contract.
 */

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'commission'
  | 'referral_bonus'
  | 'pool_investment'
  | 'pool_return'
  | 'activation'
  | 'subscription'
  | 'adjustment'

export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type WithdrawalStatus =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'

export interface Wallet {
  walletId: string
  bitcoinAddress: string
  balance: number
  pendingBalance: number
  totalDeposited: number
  totalWithdrawn: number
}

export interface WalletSummary extends Wallet {
  pendingWithdrawals: number
  transactionCount: number
}

export interface DepositAddress {
  bitcoinAddress: string
  amountRequired: number
}

export interface Transaction {
  transactionId: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  description?: string
  bitcoinTxId?: string
  confirmations: number
  createdAt?: string
  completedAt?: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TransactionHistory {
  transactions: Transaction[]
  pagination: Pagination
}

export interface ListTransactionsParams {
  type?: TransactionType
  status?: TransactionStatus
  page?: number
  limit?: number
}

export interface WithdrawalResult {
  withdrawalId: string
  amount: number
  fee: number
  netAmount: number
  status: WithdrawalStatus
  bitcoinTxId?: string
  message?: string
}

/** Mnemonic + derivation info returned by GET /wallet/mnemonic. */
export interface MnemonicInfo {
  mnemonic: string
  derivationPath: string
  xpub: string
}

/** Result of POST /wallet/send. */
export interface SendPaymentResult {
  txid: string
  fee: number
  amount: number
  change: number
}

/** Standard API envelope returned by the backend on success. */
export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
}
