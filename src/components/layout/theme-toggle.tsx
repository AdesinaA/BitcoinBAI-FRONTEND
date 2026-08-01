'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * Theme toggle — switches between light and dark, honoring the system
 * preference configured in the root ThemeProvider. Renders a ghost
 * icon button with an animated Sun/Moon cross-fade.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch: theme is only known on the client.
  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className={cn('relative', className)}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {mounted ? (
        <>
          <Sun
            className={cn(
              'h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all',
              isDark && '-rotate-90 scale-0'
            )}
            aria-hidden="true"
          />
          <Moon
            className={cn(
              'absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all',
              isDark && 'rotate-0 scale-100'
            )}
            aria-hidden="true"
          />
        </>
      ) : (
        <span className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
