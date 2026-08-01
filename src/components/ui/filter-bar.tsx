import * as React from 'react'
import { Filter, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
} from '@/components/ui/dropdown'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterDefinition {
  key: string
  label: string
  type: 'select' | 'search' | 'date'
  options?: FilterOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export interface ActiveFilter {
  key: string
  label: string
  value: string
}

export interface FilterBarProps {
  /** Search input configuration. */
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  /** Filter definitions shown in the dropdown. */
  filters?: FilterDefinition[]
  /** Currently active filters (for display). */
  activeFilters?: ActiveFilter[]
  /** Remove an active filter. */
  onRemoveFilter?: (key: string) => void
  /** Clear all active filters. */
  onClearAll?: () => void
  /** Number of active filters (for badge). */
  activeCount?: number
  className?: string
}

/**
 * Premium filter bar with search, dropdown filters, and active filter chips.
 * Clean, minimal, and accessible.
 */
export function FilterBar({
  searchPlaceholder = 'Search…',
  searchValue = '',
  onSearchChange,
  filters = [],
  activeFilters = [],
  onRemoveFilter,
  onClearAll,
  activeCount,
  className,
}: FilterBarProps) {
  const hasActiveFilters = activeFilters.length > 0

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center gap-3">
        {onSearchChange && (
          <div className="relative w-full min-w-[240px] flex-1">
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
            <Filter
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
              aria-hidden="true"
            />
          </div>
        )}

        {filters.length > 0 && (
          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-1.5">
                Filter
                {activeCount !== undefined && activeCount > 0 ? (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    {activeCount}
                  </Badge>
                ) : null}
              </Button>
            </DropdownTrigger>
            <DropdownContent align="start" className="w-64">
              <div className="p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Filters
                </p>
              </div>
              <div className="border-t border-border/70 py-2">
                {filters.map((filter) => (
                  <div key={filter.key} className="px-3 py-2">
                    <p className="mb-2 text-xs text-text-tertiary">{filter.label}</p>
                    {filter.type === 'select' ? (
                      <Select
                        value={filter.value}
                        onChange={filter.onChange}
                        placeholder={filter.placeholder}
                        className="h-8 text-sm"
                      >
                        {filter.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                    ) : filter.type === 'search' ? (
                      <Input
                        type="search"
                        placeholder={filter.placeholder}
                        value={filter.value}
                        onChange={(e) => filter.onChange(e.target.value)}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <Input
                        type="date"
                        value={filter.value}
                        onChange={(e) => filter.onChange(e.target.value)}
                        className="h-8 text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
              {hasActiveFilters && (
                <div className="border-t border-border/70 p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-xs"
                    onClick={onClearAll}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </DropdownContent>
          </Dropdown>
        )}

        {hasActiveFilters && onRemoveFilter && (
          <div className="flex flex-wrap items-center gap-1.5">
            {activeFilters.map((f) => (
              <Badge
                key={f.key}
                variant="secondary"
                className="gap-1 pr-1.5 text-xs"
              >
                {f.label}: {f.value}
                <button
                  type="button"
                  onClick={() => onRemoveFilter(f.key)}
                  className="rounded p-0.5 hover:bg-surface"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
