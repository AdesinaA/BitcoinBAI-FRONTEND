'use client'

import * as React from 'react'

/** Local storage flag set once we've ever observed the app running installed. */
const INSTALLED_FLAG_KEY = 'bai-pwa-installed'

/** Chrome/Android's deferred install prompt event (not in lib.dom.d.ts). */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type PwaPlatform = 'ios' | 'android' | 'other'

function detectPlatform(): PwaPlatform {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  // iPadOS 13+ reports as Mac; distinguish via touch support.
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return 'other'
}

function isRunningStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const iosStandalone = (window.navigator as { standalone?: boolean }).standalone
  return Boolean(iosStandalone) || window.matchMedia('(display-mode: standalone)').matches
}

/**
 * Tracks whether the app is installed (or running installed) and exposes
 * an install trigger for Android/Chrome's native prompt. Uses a persisted
 * flag so that once we ever observe standalone mode (the user opened the
 * installed icon at least once), we never resurface the install prompt
 * again on that device — this is the only reliable "installed" signal on
 * iOS, which has no install event of its own.
 */
export function usePwaInstall() {
  const [platform] = React.useState<PwaPlatform>(() => detectPlatform())
  const [isInstalled, setIsInstalled] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return (
      isRunningStandalone() ||
      window.localStorage.getItem(INSTALLED_FLAG_KEY) === '1'
    )
  })
  const deferredPromptRef = React.useRef<BeforeInstallPromptEvent | null>(null)
  const [canPromptInstall, setCanPromptInstall] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    if (isRunningStandalone()) {
      window.localStorage.setItem(INSTALLED_FLAG_KEY, '1')
      setIsInstalled(true)
      return
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      deferredPromptRef.current = event as BeforeInstallPromptEvent
      setCanPromptInstall(true)
    }

    function handleAppInstalled() {
      window.localStorage.setItem(INSTALLED_FLAG_KEY, '1')
      setIsInstalled(true)
      setCanPromptInstall(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  /** Trigger the native Android/Chrome install dialog. No-op elsewhere. */
  async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    const deferred = deferredPromptRef.current
    if (!deferred) return 'unavailable'
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    deferredPromptRef.current = null
    setCanPromptInstall(false)
    return outcome
  }

  return { platform, isInstalled, canPromptInstall, promptInstall }
}
