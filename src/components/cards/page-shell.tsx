import * as React from 'react'

import { cn } from '@/lib/utils'

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto flex w-full max-w-[1600px] flex-col gap-8', className)}>
      {children}
    </div>
  )
}