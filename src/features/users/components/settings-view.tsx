'use client'

import * as React from 'react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import * as userService from '../services/user-service'
import type { UserSettings } from '../types'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
]

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'NGN', label: 'NGN — Nigerian Naira' },
]

interface ToggleRowProps {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleRow({ id, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border p-4"
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-muted transition-colors checked:bg-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        role="switch"
        aria-checked={checked}
      />
    </label>
  )
}

export function SettingsView() {
  const { toast } = useToast()
  const [settings, setSettings] = React.useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    userService
      .getSettings()
      .then((s) => {
        if (!cancelled) setSettings(s)
      })
      .catch((error) => {
        if (!cancelled) {
          toast({
            title: 'Failed to load settings',
            description: getApiErrorMessage(error),
            variant: 'destructive',
          })
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [toast])

  function patch(partial: Partial<UserSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...partial } : prev))
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return
    setIsSaving(true)
    try {
      const updated = await userService.updateSettings(settings)
      setSettings(updated)
      toast({ title: 'Settings saved' })
    } catch (error) {
      toast({
        title: 'Save failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !settings) {
    return <Skeleton className="h-96 rounded-lg" />
  }

  return (
    <form onSubmit={onSave} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose how you want to be notified about account activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow
            id="emailNotifications"
            label="Email notifications"
            description="Receive important updates by email."
            checked={settings.emailNotifications}
            onChange={(v) => patch({ emailNotifications: v })}
          />
          <ToggleRow
            id="smsNotifications"
            label="SMS notifications"
            description="Receive security alerts by SMS."
            checked={settings.smsNotifications}
            onChange={(v) => patch({ smsNotifications: v })}
          />
          <ToggleRow
            id="marketingEmails"
            label="Marketing emails"
            description="Occasional product news and offers."
            checked={settings.marketingEmails}
            onChange={(v) => patch({ marketingEmails: v })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Localization and display preferences.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              id="language"
              value={settings.language}
              onChange={(e) => patch({ language: e })}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              id="currency"
              value={settings.currency}
              onChange={(e) => patch({ currency: e })}
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value={settings.timezone}
              onChange={(e) => patch({ timezone: e.target.value })}
              placeholder="UTC"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" variant="gold" isLoading={isSaving}>
          Save settings
        </Button>
      </div>
    </form>
  )
}
