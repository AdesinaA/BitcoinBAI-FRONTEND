'use client'

import { Activity } from 'lucide-react'

import { PagePlaceholder } from '@/components/shared/page-placeholder'

export default function Page() {
  return (
    <PagePlaceholder
      title="Reports"
      description="Your activity and financial reports."
      icon={Activity}
    />
  )
}
