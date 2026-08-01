import {
  Activity,
  Bell,
  Bitcoin,
  Gauge,
  LayoutDashboard,
  Network,
  Settings,
  Shield,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

/**
 * Navigation configuration — single source of truth for all app
 * navigation. Layouts (sidebar, mobile nav, breadcrumbs) read from
 * these definitions so items/active states stay consistent.
 * Routes align with the feature folders and API surface
 * (docs/03_FUNCTIONAL_SPECIFICATION.md, docs/06_API_SPECIFICATION.md).
 */

export interface NavItem {
  /** Display label. */
  title: string
  /** Route path. */
  href: string
  /** Lucide icon for the item. */
  icon: LucideIcon
  /** When true, item is active only on an exact path match. */
  exact?: boolean
  /** Optional badge text (e.g. "New"). */
  badge?: string
}

export interface NavSection {
  /** Optional section heading shown in the sidebar. */
  label?: string
  items: NavItem[]
}

/* Public (marketing/auth) top-level navigation. */
export const publicNavItems: NavItem[] = [
  { title: 'Home', href: '/', icon: LayoutDashboard, exact: true },
  { title: 'Sign in', href: '/login', icon: Users },
  { title: 'Get started', href: '/register', icon: Activity },
]

/* Member dashboard navigation (grouped). */
export const dashboardNavSections: NavSection[] = [
  {
    items: [
      {
        title: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
        exact: true,
      },
      { title: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
      { title: 'Binary Network', href: '/dashboard/binary', icon: Network },
      { title: 'Referrals', href: '/dashboard/referral', icon: Users },
      { title: 'Pools', href: '/dashboard/pools', icon: Bitcoin },
      { title: 'AI Assistant', href: '/dashboard/ai', icon: Gauge },
    ],
  },
  {
    label: 'Account',
    items: [
      { title: 'Notifications', href: '/dashboard/notifications', icon: Bell },
      { title: 'Reports', href: '/dashboard/reports', icon: Activity },
      { title: 'Profile', href: '/dashboard/profile', icon: Users },
      { title: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
]

/* Admin console navigation. */
export const adminNavSections: NavSection[] = [
  {
    items: [
      {
        title: 'Analytics',
        href: '/admin',
        icon: Gauge,
        exact: true,
      },
      { title: 'Users', href: '/admin/users', icon: Users },
      { title: 'Wallets', href: '/admin/wallets', icon: Wallet },
      { title: 'Binary', href: '/admin/binary', icon: Network },
      { title: 'Compensation', href: '/admin/compensation', icon: Bitcoin },
      { title: 'Investment Pools', href: '/admin/pools', icon: Activity },
      { title: 'Programs', href: '/admin/programs', icon: Settings },
    ],
  },
  {
    label: 'Reports & Settings',
    items: [
      { title: 'Reports', href: '/admin/reports', icon: Activity },
      { title: 'Audit Logs', href: '/admin/audit-logs', icon: Shield },
      { title: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

/** Flattened helpers for breadcrumb label lookups. */
export const allNavItems: NavItem[] = [
  ...publicNavItems,
  ...dashboardNavSections.flatMap((s) => s.items),
  ...adminNavSections.flatMap((s) => s.items),
]
