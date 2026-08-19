'use client'

import * as React from 'react'

import { usePwaInstall } from '@/hooks/use-pwa-install'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { InstallAppSheet } from './install-app-sheet'

/** How long after becoming authenticated before the sheet first appears. */
const TRIGGER_DELAY_MS = 30_000

/**
 * Session-level "snooze" so dismissing the sheet doesn't immediately
 * reopen it on the same page load, while still reappearing on the next
 * visit/login as long as the app isn't installed — per the requirement
 * that this keeps prompting until the user actually installs.
 */
const SESSION_DISMISS_KEY = 'bai-pwa-prompt-dismissed-session'

/**
 * Mounted once in the dashboard shell. Shows the "Add to Home Screen"
 * bottom sheet 30 seconds after the user is authenticated, and keeps
 * reappearing on future visits/logins until the app is actually
 * installed — never shown again once installed.
 */
export function InstallPromptController() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { platform, isInstalled, canPromptInstall, promptInstall } =
    usePwaInstall()
  const [open, setOpen] = React.useState(false)
  const [isInstalling, setIsInstalling] = React.useState(false)

  React.useEffect(() => {
    if (!isAuthenticated || isInstalled || platform === 'other') return
    if (typeof window === 'undefined') return
    if (window.sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') return

    const timer = window.setTimeout(() => {
      setOpen(true)
    }, TRIGGER_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [isAuthenticated, isInstalled, platform])

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next && typeof window !== 'undefined') {
      // Snooze for the rest of this browser session only — the prompt
      // returns next visit/login since the user hasn't installed yet.
      window.sessionStorage.setItem(SESSION_DISMISS_KEY, '1')
    }
  }

  async function handleInstallClick() {
    setIsInstalling(true)
    try {
      await promptInstall()
    } finally {
      setIsInstalling(false)
      setOpen(false)
    }
  }

  if (!isAuthenticated || isInstalled || platform === 'other') return null

  return (
    <InstallAppSheet
      open={open}
      onOpenChange={handleOpenChange}
      platform={platform}
      canPromptInstall={canPromptInstall}
      onInstallClick={handleInstallClick}
      isInstalling={isInstalling}
    />
  )
}
