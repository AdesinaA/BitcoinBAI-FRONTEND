import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Table — Design Language v2. Stripe-like.
 * Uppercase micro-label headers, hairline row separators, tabular figures,
 * calm hover states, optional sticky header.
 */

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    /** Wraps the table in a scroll container so `stickyHeader` on TableHeader works. */
    containerClassName?: string
  }
>(({ className, containerClassName, ...props }, ref) => (
  <div
    className={cn(
      'relative w-full overflow-auto rounded-xl border border-border bg-surface',
      containerClassName
    )}
  >
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    /** Keeps the header pinned while the body scrolls. */
    sticky?: boolean
  }
>(({ className, sticky = false, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'bg-surface-elevated/60 [&_tr]:border-b [&_tr]:border-border',
      sticky && 'sticky top-0 z-sticky backdrop-blur-sm',
      className
    )}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-border bg-surface-elevated/60 font-medium',
      className
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    /** Adds pointer + stronger hover for clickable rows. */
    interactive?: boolean
  }
>(({ className, interactive = false, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-border/70 transition-colors duration-fast',
      'hover:bg-surface-elevated/50',
      'data-[state=selected]:bg-accent/[0.06]',
      interactive && 'cursor-pointer',
      className
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    /** Right-align for numeric columns. */
    numeric?: boolean
  }
>(({ className, numeric = false, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-11 px-4 text-left align-middle',
      'text-[11px] font-medium uppercase tracking-wider text-text-tertiary',
      numeric && 'text-right',
      '[&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    /** Right-aligned tabular figures for amounts. */
    numeric?: boolean
  }
>(({ className, numeric = false, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'px-4 py-3.5 align-middle text-text-primary',
      numeric && 'font-numeric text-right',
      '[&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-text-tertiary', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}