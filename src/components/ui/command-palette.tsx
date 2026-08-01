import * as React from 'react'
import { Command } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export interface CommandPaletteOption {
  value: string
  label: string
  icon?: React.ReactNode
  group?: string
  onSelect?: (value: string) => void
}

export interface CommandPaletteProps {
  options: CommandPaletteOption[]
  placeholder?: string
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

export function CommandPalette({
  options,
  placeholder = 'Search...',
  isOpen = false,
  onClose,
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const filtered = React.useMemo(() => {
    if (!query) return options
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase()) ||
        opt.value.toLowerCase().includes(query.toLowerCase())
    )
  }, [options, query])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-modal flex items-start justify-center pt-[10vh]',
        className
      )}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-border bg-surface shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 p-3 border-b border-border">
          <Command className="h-4 w-4 text-text-tertiary" />
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-none bg-transparent shadow-none focus:ring-0"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="py-4 text-center text-sm text-text-tertiary">
              No results found
            </p>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.value}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent/10 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                onClick={() => {
                  opt.onSelect?.(opt.value)
                  onClose?.()
                }}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
