'use client'

import { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'

/**
 * Global Framer Motion configuration.
 * `reducedMotion="user"` respects the user's OS-level
 * prefers-reduced-motion setting (accessibility requirement).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.3, ease: 'easeInOut' }}>
      {children}
    </MotionConfig>
  )
}
