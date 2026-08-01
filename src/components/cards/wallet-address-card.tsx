import * as React from 'react'
import { Copy, Check, QrCode } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface WalletAddressCardProps {
  address: string
  label?: string
  network?: string
  verified?: boolean
  balance?: string
  onCopy?: () => void
  className?: string
}

/**
 * Premium Bitcoin address presentation.
 * Large monospace address, QR affordance, copy-to-clipboard,
 * security indicators, and optional balance.
 */
export function WalletAddressCard({
  address,
  label = 'Bitcoin Address',
  network = 'testnet',
  verified = false,
  balance,
  onCopy,
  className,
}: WalletAddressCardProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Card className={cn('border-border-strong/80', className)}>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">{label}</CardTitle>
          {verified ? (
            <Badge variant="success" className="gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success-foreground" />
              Verified
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-elevated/50 px-4 py-3">
            <code className="block break-all font-mono text-sm text-text-primary">
              {address}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="shrink-0"
              aria-label="Copy address"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4 text-text-tertiary" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Network: {network}</span>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary"
            >
              <QrCode className="h-3.5 w-3.5" />
              Show QR
            </button>
          </div>
        </div>

        {balance ? (
          <div className="border-t border-border/70 pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">
              Available
            </p>
            <p className="mt-1 font-numeric text-xl font-semibold text-text-primary">
              {balance}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
