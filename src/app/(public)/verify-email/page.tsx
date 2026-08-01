import type { Metadata } from 'next'

import { AuthCard } from '@/components/shared/auth-card'

export const metadata: Metadata = { title: 'Verify email' }

export default function Page() {
  return (
    <AuthCard title="Verify email" description="Confirm your email address." />
  )
}
