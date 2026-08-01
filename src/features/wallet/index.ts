export * from './types'
export * as walletService from './services/wallet-service'

/** Format a BTC amount to a fixed 8-decimal string (e.g. 0.00500000). */
export function formatBtc(amount: number, decimals = 8): string {
  return amount.toFixed(decimals)
}

/** Compact BTC display (trims trailing zeros, keeps at least 2 decimals). */
export function formatBtcCompact(amount: number): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}
