import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AuthCard } from '@/components/shared/auth-card'
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'
import { Spinner } from '@/components/ui/spinner'

export const metadata: Metadata = { title: 'Set new password' }

export default function Page() {
  return (
    <AuthCard
      title="Set new password"
      description="Choose a strong new password for your account."
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  )
}
