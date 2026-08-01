'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, User } from 'lucide-react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'

interface UserMenuProps {
  /** Current user's display name. */
  name?: string
  /** Current user's email (shown in the menu header). */
  email?: string
  /** Avatar image URL. */
  avatarUrl?: string
  /** Base path for account links (dashboard vs admin). */
  accountHref?: string
  /** Called after the user logs out (e.g. clear tokens). */
  onLogout?: () => void
  className?: string
}

const itemClass =
  'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

/**
 * User account dropdown — avatar trigger with profile/settings/logout
 * actions (secondary navigation, guidelines §9.2).
 */
export function UserMenu({
  name = 'Account',
  email,
  avatarUrl,
  accountHref = '/dashboard',
  onLogout,
  className,
}: UserMenuProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') localStorage.removeItem('token')
      onLogout?.()
      toast({
        variant: 'success',
        title: 'Signed out',
        description: 'You have been signed out.',
      })
      router.push('/login')
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to sign out.',
      })
    }
  }

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger
        className={cn(
          'flex items-center gap-2 rounded-full outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        aria-label="Account menu"
      >
        <Avatar src={avatarUrl} name={name} size="sm" />
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <div className="px-2 py-1.5">
            <p className="truncate text-sm font-medium">{name}</p>
            {email ? (
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            ) : null}
          </div>
          <DropdownMenuPrimitive.Separator className="-mx-1 my-1 h-px bg-border" />
          <DropdownMenuPrimitive.Item asChild className={itemClass}>
            <Link href={`${accountHref}/profile`}>
              <User className="h-4 w-4" aria-hidden="true" />
              Profile
            </Link>
          </DropdownMenuPrimitive.Item>
          <DropdownMenuPrimitive.Item asChild className={itemClass}>
            <Link href={`${accountHref}/settings`}>
              <Settings className="h-4 w-4" aria-hidden="true" />
              Settings
            </Link>
          </DropdownMenuPrimitive.Item>
          <DropdownMenuPrimitive.Separator className="-mx-1 my-1 h-px bg-border" />
          <DropdownMenuPrimitive.Item
            className={cn(itemClass, 'text-destructive focus:text-destructive')}
            onSelect={(e) => {
              e.preventDefault()
              handleLogout()
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </DropdownMenuPrimitive.Item>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}
