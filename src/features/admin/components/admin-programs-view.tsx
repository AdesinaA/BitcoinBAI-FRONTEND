'use client'

import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit, Save, Trash2, X, Plus } from 'lucide-react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import * as adminService from '../services/admin-service'
import type { SettingItem, SettingCategory } from '../types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'

const QUERY_KEY = ['admin', 'settings'] as const

function parseValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)
  return JSON.stringify(value)
}

function serializeValue(raw: string, original: unknown): unknown {
  if (typeof original === 'boolean') {
    const lower = raw.trim().toLowerCase()
    if (lower === 'true' || lower === '1') return true
    if (lower === 'false' || lower === '0') return false
    return original
  }
  if (typeof original === 'number') {
    const num = Number(raw)
    return Number.isNaN(num) ? original : num
  }
  if (typeof original === 'object') {
    try {
      return JSON.parse(raw)
    } catch {
      return original
    }
  }
  return raw
}

function groupByCategory(settings: SettingItem[]): SettingItem[][] {
  const groups: Record<string, SettingItem[]> = {}
  settings.forEach((s) => {
    const cat = s.category ?? 'platform'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(s)
  })
  return Object.values(groups)
}

function SettingRow({
  setting,
  onEdit,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: {
  setting: SettingItem
  onEdit: (setting: SettingItem) => void
  onUpdate: (
    setting: SettingItem,
    value: unknown,
    isActive: boolean
  ) => void
  onDelete: (setting: SettingItem) => void
  isUpdating: boolean
  isDeleting: boolean
}) {
  const [draftValue, setDraftValue] = React.useState<string>(
    parseValue(setting.value)
  )
  const [draftActive, setDraftActive] = React.useState(setting.isActive)
  const [editing, setEditing] = React.useState(false)

  const startEdit = () => {
    setDraftValue(parseValue(setting.value))
    setDraftActive(setting.isActive)
    setEditing(true)
    onEdit(setting)
  }

  const save = () => {
    const newValue = serializeValue(draftValue, setting.value)
    onUpdate(setting, newValue, draftActive)
    setEditing(false)
  }

  const cancel = () => {
    setDraftValue(parseValue(setting.value))
    setDraftActive(setting.isActive)
    setEditing(false)
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono text-muted-foreground">
            {setting.key}
          </code>
          <Badge variant="outline" className="capitalize">
            {setting.category}
          </Badge>
          {setting.isActive ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
        {setting.description ? (
          <p className="text-sm text-muted-foreground">{setting.description}</p>
        ) : null}
        <pre className="text-xs text-muted-foreground">
          value: {parseValue(setting.value)}
        </pre>
      </div>
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <Button size="sm" variant="ghost" onClick={save}>
              <Save className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={cancel}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button size="sm" variant="ghost" onClick={startEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          disabled={isDeleting}
          onClick={() => onDelete(setting)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function AdminProgramsView() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [editingSetting, setEditingSetting] = React.useState<SettingItem | null>(
    null
  )
  const [editValue, setEditValue] = React.useState('')
  const [editActive, setEditActive] = React.useState(true)

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: adminService.listSettings,
    staleTime: 60_000,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY })
  }

  const updateMutation = useMutation({
    mutationFn: ({
      key,
      value,
      isActive,
    }: {
      key: string
      value: unknown
      isActive: boolean
    }) => adminService.updateSetting(key, { value, isActive }),
    onSuccess: () => {
      toast({ title: 'Setting updated' })
      setEditingSetting(null)
      invalidate()
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteSetting,
    onSuccess: () => {
      toast({ title: 'Setting deleted' })
      invalidate()
    },
    onError: (error) => {
      toast({
        title: 'Delete failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    },
  })

  const handleEdit = (setting: SettingItem) => {
    setEditingSetting(setting)
    setEditValue(parseValue(setting.value))
    setEditActive(setting.isActive)
  }

  const handleUpdate = (
    setting: SettingItem,
    value: unknown,
    isActive: boolean
  ) => {
    updateMutation.mutate({ key: setting.key, value, isActive })
  }

  const handleDelete = (setting: SettingItem) => {
    if (!confirm(`Delete setting "${setting.key}"?`)) return
    deleteMutation.mutate(setting.key)
  }

  const handleSaveEdit = () => {
    if (!editingSetting) return
    const newValue = serializeValue(editValue, editingSetting.value)
    updateMutation.mutate({
      key: editingSetting.key,
      value: newValue,
      isActive: editActive,
    })
  }

  const handleCreate = () => {
    const key = prompt('Setting key (e.g. binary.max_depth):')
    if (!key) return
    const category = prompt(
      'Category (binary, referral, commission, pool, withdrawal, platform):'
    ) as SettingCategory | null
    if (!category) return
    const valueRaw = prompt('Value:')
    if (valueRaw === null) return
    const value = valueRaw.trim() !== '' ? valueRaw : undefined
    adminService
      .createSetting({ category, key, value })
      .then(() => {
        toast({ title: 'Setting created' })
        invalidate()
      })
      .catch((error) => {
        toast({
          title: 'Create failed',
          description: getApiErrorMessage(error),
          variant: 'destructive',
        })
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">
            Programs
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage platform configuration settings.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Setting
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">
          Failed to load settings.
        </p>
      ) : !settings || settings.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No settings found.
        </p>
      ) : (
        <div className="space-y-6">
          {groupByCategory(settings).map((group, i) => (
            <Card key={group[0]?.category ?? i}>
              <CardHeader>
                <CardTitle className="capitalize">
                  {group[0]?.category ?? 'Uncategorized'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {group.map((setting) => (
                    <SettingRow
                      key={setting.settingId}
                      setting={setting}
                      onEdit={handleEdit}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                      isUpdating={updateMutation.isPending}
                      isDeleting={deleteMutation.isPending}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Inline edit dialog */}
      <Dialog
        open={!!editingSetting}
        onOpenChange={(open) => {
          if (!open) setEditingSetting(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
            <DialogDescription>
              Update the value for <code>{editingSetting?.key}</code>.
            </DialogDescription>
          </DialogHeader>
          {editingSetting && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-value">Value</Label>
                <Input
                  id="edit-value"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-active"
                  checked={editActive}
                  onCheckedChange={setEditActive}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingSetting(null)}
            >
              Cancel
            </Button>
            <Button
              disabled={updateMutation.isPending}
              onClick={handleSaveEdit}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
