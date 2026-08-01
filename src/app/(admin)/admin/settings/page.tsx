'use client'

import { Settings } from 'lucide-react'

import { PagePlaceholder } from '@/components/shared/page-placeholder'

export default function Page() {
  return (
    <PagePlaceholder
      title="Platform Settings"
      description="Configure business rules and preferences."
      icon={Settings}
    />
  )
}
