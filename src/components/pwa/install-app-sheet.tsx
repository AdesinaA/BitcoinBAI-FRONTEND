'use client'

import * as React from 'react'
import Image from 'next/image'
import { Share, PlusSquare, Smartphone, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import type { PwaPlatform } from '@/hooks/use-pwa-install'

interface InstallAppSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  platform: PwaPlatform
  canPromptInstall: boolean
  onInstallClick: () => void
  isInstalling: boolean
}

/**
 * Bottom slide-up sheet that teaches users how to add Bitcoin BAI to their
 * phone's home screen. iOS has no automatic install API, so it shows the
 * manual Share -> Add to Home Screen steps; Android/Chrome gets a one-tap
 * native install button via the captured `beforeinstallprompt` event.
 */
export function InstallAppSheet({
  open,
  onOpenChange,
  platform,
  canPromptInstall,
  onInstallClick,
  isInstalling,
}: InstallAppSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="bottom" className="mx-auto max-w-lg">
        <DrawerHeader>
          <div className="mb-2 flex items-center gap-3">
            <Image
              src="/icons/icon-192.png"
              alt="Bitcoin BAI"
              width={48}
              height={48}
              className="rounded-xl"
            />
            <div>
              <DrawerTitle>Get the Bitcoin BAI app</DrawerTitle>
              <DrawerDescription>
                Faster access, home screen shortcut, and a full-screen
                experience — no app store needed.
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <DrawerBody>
          {platform === 'ios' ? (
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  1
                </span>
                <p className="text-sm text-text-secondary">
                  Tap the <Share className="mx-1 inline size-4" /> Share
                  button in Safari&apos;s toolbar.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  2
                </span>
                <p className="text-sm text-text-secondary">
                  Scroll down and tap{' '}
                  <PlusSquare className="mx-1 inline size-4" /> &quot;Add to
                  Home Screen&quot;.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  3
                </span>
                <p className="text-sm text-text-secondary">
                  Tap <span className="font-medium text-text-primary">Add</span>{' '}
                  in the top-right corner.
                </p>
              </li>
            </ol>
          ) : (
            <div className="flex items-start gap-3 rounded-lg border border-border-strong bg-surface-elevated p-4">
              <Smartphone className="mt-0.5 size-5 shrink-0 text-accent" />
              <p className="text-sm text-text-secondary">
                Tap <span className="font-medium text-text-primary">Install app</span>{' '}
                below to add Bitcoin BAI to your home screen — it takes one
                tap.
              </p>
            </div>
          )}
        </DrawerBody>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost" className="flex-1">
              <X className="mr-1 size-4" /> Not now
            </Button>
          </DrawerClose>
          {platform === 'android' && canPromptInstall ? (
            <Button
              variant="primary"
              className="flex-1"
              onClick={onInstallClick}
              isLoading={isInstalling}
            >
              Install app
            </Button>
          ) : null}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
