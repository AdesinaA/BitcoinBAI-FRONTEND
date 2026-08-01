import { AdminLayout } from '@/components/layout/admin-layout'
import { AuthGuard } from '@/features/auth/components/auth-guard'

/**
 * Route-group layout for all admin console routes
 * (e.g. /admin, /admin/users, /admin/settings).
 * Applies the admin app shell and requires an authenticated admin session.
 */
export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireRole="admin">
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  )
}
