import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontVariables } from '@/lib/fonts'
import { AppProviders } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { ServiceWorkerRegistrar } from '@/components/pwa/service-worker-registrar'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: {
    default: 'Bitcoin BAI',
    template: '%s | Bitcoin BAI',
  },
  description:
    'A modern SaaS platform for binary network participation, wallet management, and Bitcoin payments',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bitcoin BAI',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans text-foreground antialiased'
        )}
      >
        <AppProviders>{children}</AppProviders>
        <Toaster />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  )
}

