'use client'

import { Wallet } from 'lucide-react'

import { PagePlaceholder } from '@/components/shared/page-placeholder'

export default function Page() {
  return (
    <PagePlaceholder
      title="Transactions"
      description="Monitor deposits, withdrawals, and commissions."
      icon={Wallet}
    />
  )
}
