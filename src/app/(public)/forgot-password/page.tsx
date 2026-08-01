import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthCard } from '@/components/shared/auth-card'
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'

export const metadata: Metadata = { title: 'Reset password' }

export default function Page() {
  return (
    <AuthCard
      title="Reset password"
      description="Enter your email and we'll send you a reset link."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Remembered your password?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  )
}
