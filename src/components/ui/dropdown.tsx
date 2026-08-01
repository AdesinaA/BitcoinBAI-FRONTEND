import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

const Dropdown = DropdownMenu
const DropdownTrigger = DropdownMenuTrigger
const DropdownPortal = DropdownMenuPortal
const DropdownGroup = DropdownMenuGroup
const DropdownLabel = DropdownMenuLabel
const DropdownSeparator = DropdownMenuSeparator
const DropdownSub = DropdownMenuSub
const DropdownSubTrigger = DropdownMenuSubTrigger
const DropdownSubContent = DropdownMenuSubContent
const DropdownCheckboxItem = DropdownMenuCheckboxItem

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPortal>
    <DropdownMenuContent
      ref={ref}
      className={cn(
        'z-dropdown min-w-32 overflow-hidden rounded-md border border-border bg-surface p-1 text-sm text-text-primary shadow-lg',
        className
      )}
      {...props}
    />
  </DropdownMenuPortal>
))
DropdownContent.displayName = 'DropdownContent'

const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItem>
>(({ className, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 text-sm outline-none',
      'focus:bg-accent/10 focus:text-text-primary',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  />
))
DropdownItem.displayName = 'DropdownItem'

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownGroup,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
  DropdownPortal,
}
