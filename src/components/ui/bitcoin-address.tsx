import * as React from 'react'
import { cn } from '@/lib/utils'
import { CopyButton } from '@/components/ui/copy-button'

export interface BitcoinAddressProps {
  address: string
  showCopy?: boolean
  truncate?: boolean
  className?: string
}

export function BitcoinAddress({
  address,
  showCopy = true,
  truncate = true,
  className,
}: BitcoinAddressProps) {
  const displayAddress = truncate
    ? `${address.slice(0, 10)}...${address.slice(-10)}`
    : address

  return (
    <div
      className={cn(
        'flex items-center gap-2 font-mono text-sm',
        className
      )}
    >
      <code
        className="rounded bg-surface-elevated px-2 py-1 text-text-primary"
        aria-label="Bitcoin address"
      >
        {displayAddress}
      </code>
      {showCopy && <CopyButton text={address} />}
    </div>
  )
}
