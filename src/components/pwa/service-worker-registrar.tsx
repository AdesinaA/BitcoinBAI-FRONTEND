'use client'

import * as React from 'react'

/**
 * Registers the minimal service worker required for the platform to be
 * "installable" as a PWA (Add to Home Screen on iOS, native install
 * prompt on Android/Chrome). Mounted once in the root layout.
 */
export function ServiceWorkerRegistrar() {
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Non-critical: the app works fine without an active service worker,
      // it just won't be installable on browsers that require one.
    })
  }, [])

  return null
}
