'use client'

import * as React from 'react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import * as userService from '../services/user-service'
import type { ActivityItem, UserProfile, UserStatus } from '../types'

const STATUS_VARIANT: Record<UserStatus, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  active: 'success',
  pending: 'warning',
  suspended: 'destructive',
  deactivated: 'secondary',
}

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString()
}

export function ProfileView() {
  const { toast } = useToast()
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [activity, setActivity] = React.useState<ActivityItem[] | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)

  const [fullName, setFullName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [bio, setBio] = React.useState('')
  const [avatarUrl, setAvatarUrl] = React.useState('')

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [p, a] = await Promise.all([
          userService.getProfile(),
          userService.getActivity(50).catch(() => []),
        ])
        if (cancelled) return
        setProfile(p)
        setActivity(a)
        setFullName(p.fullName ?? '')
        setPhone(p.phone ?? '')
        setBio(p.bio ?? '')
        setAvatarUrl(p.avatar ?? '')
      } catch (error) {
        if (!cancelled) {
          toast({
            title: 'Failed to load profile',
            description: getApiErrorMessage(error),
            variant: 'destructive',
          })
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [toast])

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    try {
      const updated = await userService.updateProfile({
        fullName: fullName || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
      })
      setProfile(updated)
      toast({ title: 'Profile updated' })
    } catch (error) {
      toast({
        title: 'Update failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function onSaveAvatar(e: React.FormEvent) {
    e.preventDefault()
    setIsUploading(true)
    try {
      const updated = await userService.updateAvatar(avatarUrl)
      setProfile(updated)
      toast({ title: 'Avatar updated' })
    } catch (error) {
      toast({
        title: 'Avatar update failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-lg" />
        <Skeleton className="h-72 rounded-lg lg:col-span-2" />
      </div>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Could not load your profile. Please try again.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left: identity card */}
      <Card>
        <CardHeader className="items-center text-center">
          <Avatar
            size="xl"
            src={profile.avatar}
            name={profile.fullName ?? profile.username}
          />
          <CardTitle className="mt-4">{profile.fullName ?? profile.username}</CardTitle>
          <CardDescription>@{profile.username}</CardDescription>
          <div className="mt-2 flex gap-2">
            <Badge variant={STATUS_VARIANT[profile.status]} className="capitalize">
              {profile.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {profile.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{profile.email}</p>
          </div>
          {profile.referralCode ? (
            <div>
              <p className="text-muted-foreground">Referral code</p>
              <p className="font-mono font-medium">{profile.referralCode}</p>
            </div>
          ) : null}
          <div>
            <p className="text-muted-foreground">Last login</p>
            <p className="font-medium">{formatDate(profile.lastLoginAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Member since</p>
            <p className="font-medium">{formatDate(profile.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Right: tabbed edit + activity */}
      <Card className="lg:col-span-2">
        <Tabs defaultValue="profile">
          <CardHeader>
            <TabsList>
              <TabsTrigger value="profile">Edit profile</TabsTrigger>
              <TabsTrigger value="avatar">Avatar</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="profile">
              <form onSubmit={onSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                    maxLength={500}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <Button type="submit" variant="gold" isLoading={isSaving}>
                  Save changes
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="avatar">
              <form onSubmit={onSaveAvatar} className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar size="lg" src={avatarUrl} name={profile.fullName ?? profile.username} />
                  <p className="text-sm text-muted-foreground">
                    Paste an image URL to use as your avatar. Leave your initials
                    as the fallback when empty.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar image URL</Label>
                  <Input
                    id="avatar"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                  />
                </div>
                <Button type="submit" variant="gold" isLoading={isUploading}>
                  Update avatar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="activity">
              {activity && activity.length > 0 ? (
                <ul className="space-y-4">
                  {activity.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.message}</p>
                        <p className="text-xs text-muted-foreground">{item.type}</p>
                      </div>
                      <p className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No activity recorded yet.
                </p>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
