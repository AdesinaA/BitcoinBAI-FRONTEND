import { PublicLayout } from '@/components/layout/public-layout'

/**
 * Route-group layout for all public/auth routes
 * (/, /login, /register, /verify-email, /forgot-password).
 * Applies the public layout (slim navbar + footer) to every child page.
 */
export default function PublicGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
