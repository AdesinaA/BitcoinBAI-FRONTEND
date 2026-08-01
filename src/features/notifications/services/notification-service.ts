import { apiClient } from '@/lib/api-client'
import type {
  ApiSuccess,
  NotificationHistory,
  NotificationPreferences,
  UnreadCount,
} from '../types'

/** Notification service — thin wrappers around the backend endpoints. */

export async function getNotifications(
  page = 1,
  limit = 20,
  status?: string,
  type?: string
): Promise<NotificationHistory> {
  const { data } = await apiClient.get<ApiSuccess<NotificationHistory>>(
    '/notifications',
    { params: { page, limit, status, type } }
  )
  return data.data
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<ApiSuccess<UnreadCount>>(
    '/notifications/unread-count'
  )
  return data.data.count
}

export async function markRead(notificationId: string): Promise<unknown> {
  const { data } = await apiClient.patch<ApiSuccess<unknown>>(
    `/notifications/${notificationId}/read`
  )
  return data.data
}

export async function markAllRead(): Promise<{ modified: number }> {
  const { data } = await apiClient.patch<ApiSuccess<{ modified: number }>>(
    '/notifications/mark-all-read'
  )
  return data.data
}

export async function getPreferences(): Promise<NotificationPreferences> {
  const { data } = await apiClient.get<ApiSuccess<NotificationPreferences>>(
    '/notifications/preferences'
  )
  return data.data
}

export async function updatePreferences(
  prefs: Record<string, boolean>
): Promise<NotificationPreferences> {
  const { data } = await apiClient.patch<ApiSuccess<NotificationPreferences>>(
    '/notifications/preferences',
    prefs
  )
  return data.data
}
