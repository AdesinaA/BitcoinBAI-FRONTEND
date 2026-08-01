import { apiClient } from '@/lib/api-client'
import type { ApiSuccess } from '../types'

/**
 * Bitcoin service — blockchain utilities (network status, tx/address lookups,
 * deposit verification) backed by the Bitcoin module.
 */

export type BitcoinNetwork = 'mainnet' | 'testnet' | 'regtest'

export interface BlockchainStatus {
  network: BitcoinNetwork
  online: boolean
  blockHeight?: number
  requiredConfirmations: number
}

export interface TxStatus {
  txid: string
  confirmed: boolean
  confirmations: number
  blockHeight?: number
  blockTime?: number
}

export interface AddressTx {
  txid: string
  amount: number
  confirmations: number
  confirmed: boolean
  blockTime?: number
}

export interface DepositVerification {
  received: number
  confirmedAmount: number
  requiredConfirmations: number
  transactions: AddressTx[]
}

export async function getBlockchainStatus(): Promise<BlockchainStatus> {
  const { data } = await apiClient.get<ApiSuccess<BlockchainStatus>>('/bitcoin/status')
  return data.data
}

export async function getTransactionStatus(txid: string): Promise<TxStatus | null> {
  const { data } = await apiClient.get<ApiSuccess<TxStatus | null>>(`/bitcoin/tx/${txid}`)
  return data.data
}

export async function verifyAddress(address: string): Promise<DepositVerification> {
  const { data } = await apiClient.get<ApiSuccess<DepositVerification>>(
    `/bitcoin/address/${address}/verify`
  )
  return data.data
}

/** Trigger a server-side deposit sync for the authenticated wallet. */
export async function syncDeposits(): Promise<void> {
  await apiClient.post('/wallet/sync-deposits')
}
