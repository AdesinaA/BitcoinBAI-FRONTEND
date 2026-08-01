'use client'

import { Activity } from 'lucide-react'

import { PagePlaceholder } from '@/components/shared/page-placeholder'

export default function Page() {
  return (
    <PagePlaceholder
      title="Reports"
      description="Generate and view platform reports."
      icon={Activity}
    />
  )
}
