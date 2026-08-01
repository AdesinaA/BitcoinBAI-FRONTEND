/**
 * Users feature API types — mirror the backend Users module contract.
 */

export type UserRole = 'user' | 'admin'
export type UserStatus = 'pending' | 'active' | 'suspended' | 'deactivated'

export interface UserProfile {
  userId: string
  email: string
  username: string
  fullName?: string
  phone?: string
  bio?: string
  avatar?: string
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  referralCode?: string
  lastLoginAt?: string
  createdAt?: string
}

export interface UserSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
  language: string
  currency: string
  timezone: string
}

export interface ActivityItem {
  id: string
  type: string
  message: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  createdAt?: string
}

export interface PaginatedUsers {
  items: UserProfile[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ListUsersParams {
  page?: number
  limit?: number
  search?: string
  status?: UserStatus
  role?: UserRole
}

/** Standard API envelope returned by the backend on success. */
export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
}
