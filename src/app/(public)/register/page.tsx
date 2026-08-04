import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthCard } from '@/components/shared/auth-card'
import { FloatingBitcoin } from '@/components/shared/floating-bitcoin'
import { RegisterForm } from '@/features/auth/components/register-form'

export const metadata: Metadata = { title: 'Create account' }

export default function Page() {
  return (
    <div className="relative overflow-hidden">
      <FloatingBitcoin count={14} seed={11} />
      <div className="relative z-10">
        <AuthCard
          title="Create account"
          description="Join the platform."
          footer={
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          }
        >
          <RegisterForm />
        </AuthCard>
      </div>
    </div>
  )
}