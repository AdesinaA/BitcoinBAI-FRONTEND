'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  /** Controlled value. */
  value: string
  /** Called on every keystroke with the raw value. */
  onValueChange: (value: string) => void
  /** Optional debounced callback (default delay 300ms per guidelines §21.4). */
  onDebouncedChange?: (value: string) => void
  /** Debounce delay in ms. Defaults to 300. */
  debounceMs?: number
  /** Called when the input is cleared via the clear button. */
  onClear?: () => void
}

/**
 * Search input with a leading icon, clear button, and optional
 * debounced change handler. Keeps `value` fully controlled while
 * notifying consumers after the debounce window for API calls.
 */
const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value,
      onValueChange,
      onDebouncedChange,
      debounceMs = 300,
      onClear,
      placeholder = 'Search…',
      ...props
    },
    ref
  ) => {
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(() => {
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
      }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value
      onValueChange(next)
      if (onDebouncedChange) {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(
          () => onDebouncedChange(next),
          debounceMs
        )
      }
    }

    const handleClear = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      onValueChange('')
      onDebouncedChange?.('')
      onClear?.()
    }

    return (
      <div className={cn('relative', className)}>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={ref}
          type="search"
          role="searchbox"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background py-2 pl-9 pr-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-search-cancel-button]:hidden'
          )}
          {...props}
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

export { SearchInput }
