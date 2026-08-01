/**
 * Notification feature API types — mirror the backend Notification module.
 */

export type NotificationType = 'email' | 'in_app' | 'system'
export type NotificationStatus = 'unread' | 'read' | 'sent' | 'failed'
export type NotificationPriority = 'low' | 'medium' | 'high'

export interface Notification {
  notificationId: string
  userId: string
  type: NotificationType
  title: string
  message: string
  status: NotificationStatus
  priority: NotificationPriority
  relatedId: string | null
  readAt: string | null
  sentAt: string | null
  createdAt: string
}

export interface NotificationHistory {
  notifications: Notification[]
  unreadCount: number
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UnreadCount {
  count: number
}

export interface NotificationPreferences {
  userId: string
  email: boolean
  inApp: boolean
  system: boolean
  marketing: boolean
}

export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
}
