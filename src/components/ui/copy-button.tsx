import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface CopyButtonProps {
  text: string
  label?: string
  className?: string
  onCopy?: () => void
}

export function CopyButton({
  text,
  label,
  className,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    })
  }, [text, onCopy])

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('h-6 px-2', className)}
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="h-3 w-3 text-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {label && <span className="ml-1 text-xs">{label}</span>}
    </Button>
  )
}
