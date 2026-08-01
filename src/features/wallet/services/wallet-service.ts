import { apiClient } from '@/lib/api-client'
import type {
  ApiSuccess,
  DepositAddress,
  ListTransactionsParams,
  MnemonicInfo,
  SendPaymentResult,
  TransactionHistory,
  Wallet,
  WalletSummary,
  WithdrawalResult,
} from '../types'

/**
 * Wallet service — thin wrappers around the backend Wallet module endpoints.
 */

export async function getWallet(): Promise<Wallet> {
  const { data } = await apiClient.get<ApiSuccess<Wallet>>('/wallet')
  return data.data
}

export async function getSummary(): Promise<WalletSummary> {
  const { data } = await apiClient.get<ApiSuccess<WalletSummary>>('/wallet/summary')
  return data.data
}

export async function getDepositAddress(): Promise<DepositAddress> {
  const { data } = await apiClient.get<ApiSuccess<DepositAddress>>(
    '/wallet/deposit-address'
  )
  return data.data
}

export async function getTransactions(
  params: ListTransactionsParams = {}
): Promise<TransactionHistory> {
  const { data } = await apiClient.get<ApiSuccess<TransactionHistory>>(
    '/wallet/transactions',
    { params }
  )
  return data.data
}

/** Amount is provided in BTC and converted to satoshis for the API. */
export async function createWithdrawal(
  amountBtc: number,
  bitcoinAddress: string
): Promise<WithdrawalResult> {
  const satoshis = Math.round(amountBtc * 100_000_000)
  const { data } = await apiClient.post<ApiSuccess<WithdrawalResult>>(
    '/wallet/withdrawals',
    { amount: satoshis, bitcoinAddress }
  )
  return data.data
}

/** Fetch the user's BIP39 mnemonic, derivation path, and xpub. */
export async function getMnemonic(): Promise<MnemonicInfo> {
  const { data } = await apiClient.get<ApiSuccess<MnemonicInfo>>('/wallet/mnemonic')
  return data.data
}

/**
 * Send Bitcoin to an external address. Amount is in BTC; converted to
 * satoshis before sending to the API.
 */
export async function sendPayment(
  toAddress: string,
  amountBtc: number
): Promise<SendPaymentResult> {
  const satoshis = Math.round(amountBtc * 100_000_000)
  const { data } = await apiClient.post<ApiSuccess<SendPaymentResult>>(
    '/wallet/send',
    { amount: satoshis, bitcoinAddress: toAddress }
  )
  return data.data
}

/** Trigger a server-side deposit sync for the authenticated wallet. */
export async function syncDeposits(): Promise<void> {
  await apiClient.post('/wallet/sync-deposits')
}
