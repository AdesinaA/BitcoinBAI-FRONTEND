'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import { QueryProvider } from './query-provider'
import { MotionProvider } from './motion-provider'

/**
 * Composes all client-side context providers in a single wrapper.
 * Order matters: Theme -> Query -> Motion -> children.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <MotionProvider>{children}</MotionProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
