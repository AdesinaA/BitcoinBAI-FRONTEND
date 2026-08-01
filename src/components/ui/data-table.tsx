import * as React from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export interface ColumnDef<T> {
  /** Unique key for the column. */
  key: string
  /** Header label (uppercase micro-label style). */
  header: string
  /** Whether the column is numeric (right-aligned, tabular figures). */
  numeric?: boolean
  /** Render the cell content for a row. */
  cell: (row: T) => React.ReactNode
  /** Optional className for the cell. */
  className?: string
}

export interface DataTableProps<T> {
  /** Column definitions. */
  columns: ColumnDef<T>[]
  /** Data to render. */
  data: T[]
  /** Currently selected row IDs (for multi-select). */
  selectedIds?: string[]
  /** Called when row selection changes. */
  onSelectionChange?: (ids: string[]) => void
  /** Unique row key accessor. */
  getRowId?: (row: T) => string
  /** Global search placeholder. */
  searchPlaceholder?: string
  /** External search value (controlled). */
  searchValue?: string
  /** Called on search input change. */
  onSearchChange?: (value: string) => void
  /** Filter dropdowns. Each entry maps to a Select. */
  filters?: {
    key: string
    label: string
    value: string
    options: { value: string; label: string }[]
    onChange: (value: string) => void
  }[]
  /** Pagination state. */
  pagination?: {
    page: number
    totalPages: number
    pageSize: number
    totalItems: number
    onPageChange: (page: number) => void
    onPageSizeChange?: (size: number) => void
  }
  /** Loading state. */
  loading?: boolean
  /** Empty state. */
  emptyMessage?: string
  /** Row click handler. */
  onRowClick?: (row: T) => void
  /** Sticky header. */
  stickyHeader?: boolean
  className?: string
}

/**
 * Premium data table with search, filters, pagination, and selection.
 * Stripe-like styling: hairline separators, uppercase micro-labels,
 * tabular figures, calm hover states.
 */
export function DataTable<T extends object>({
  columns,
  data,
  selectedIds = [],
  onSelectionChange,
  getRowId,
  searchPlaceholder = 'Search…',
  searchValue = '',
  onSearchChange,
  filters = [],
  pagination,
  loading = false,
  emptyMessage = 'No results found.',
  onRowClick,
  stickyHeader = true,
  className,
}: DataTableProps<T>) {
  const [_selectAll, setSelectAll] = React.useState(false)

  const resolveRowId = getRowId ?? ((row: T) => String((row as { id?: string }).id ?? ''))
  const toggleSelection = onSelectionChange !== undefined

  const allSelected =
    data.length > 0 && data.every((row) => selectedIds.includes(resolveRowId(row)))

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([])
    } else {
      onSelectionChange?.(data.map((row) => resolveRowId(row)))
    }
    setSelectAll(!allSelected)
  }

  const handleSelectRow = (row: T) => {
    const id = resolveRowId(row)
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((s) => s !== id)
      : [...selectedIds, id]
    onSelectionChange?.(newSelected)
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Toolbar: search + filters */}
      {(onSearchChange || filters.length > 0) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {onSearchChange && (
            <div className="relative w-full sm:max-w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => (
                <Select
                  key={filter.key}
                  value={filter.value}
                  onChange={filter.onChange}
                  placeholder={filter.label}
                  className="sm:w-[180px]"
                >
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full caption-bottom text-sm">
          <thead
            className={cn(
              'bg-surface-elevated/60',
              stickyHeader && 'sticky top-0 z-sticky backdrop-blur-sm',
              '[&_tr]:border-b [&_tr]:border-border'
            )}
          >
            <tr>
              {toggleSelection && (
                <th className="h-11 px-4 text-left align-middle">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-border"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'h-11 px-4 text-left align-middle',
                    'text-[11px] font-medium uppercase tracking-wider text-text-tertiary',
                    col.numeric && 'text-right'
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: columns.length + (toggleSelection ? 1 : 0) }).map(
                    (_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <Skeleton className="h-4 w-full max-w-[100px]" />
                      </td>
                    )
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (toggleSelection ? 1 : 0)}
                  className="py-12 text-center text-sm text-text-tertiary"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={resolveRowId(row) || rowIndex}
                  className={cn(
                    'border-b border-border/70 transition-colors duration-fast',
                    'hover:bg-surface-elevated/50',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => {
                    if (onRowClick) onRowClick(row)
                  }}
                >
                  {toggleSelection && (
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(resolveRowId(row))}
                        onChange={() => handleSelectRow(row)}
                        className="h-4 w-4 rounded border-border"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3.5 align-middle text-text-primary',
                        col.numeric && 'font-numeric text-right',
                        col.className
                      )}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between gap-2 text-xs text-text-tertiary">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            {pagination.onPageSizeChange && (
              <Select
                value={String(pagination.pageSize)}
                onChange={(v) => pagination.onPageSizeChange?.(Number(v))}
                className="h-7 w-[70px]"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={String(size)}>
                    {size}
                  </option>
                ))}
              </Select>
            )}
          </div>
          <span>
            {pagination.totalItems} result{pagination.totalItems === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
