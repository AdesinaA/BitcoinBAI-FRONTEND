import { Inter } from 'next/font/google'

/**
 * Primary font: Inter
 * Exposed as a CSS variable (--font-inter) so Tailwind can reference it
 * via `fontFamily.sans` / `fontFamily.display`.
 */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

/** Space-separated list of all font CSS variables applied to <html>. */
export const fontVariables = inter.variable
