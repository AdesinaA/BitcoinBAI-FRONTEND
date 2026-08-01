import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AuthGuard } from '@/features/auth/components/auth-guard'

/**
 * Route-group layout for all member dashboard routes
 * (e.g. /dashboard, /dashboard/wallet, /dashboard/binary, ...).
 * Applies the dashboard app shell and requires an authenticated session.
 */
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  )
}
