import { apiClient } from '@/lib/api-client'
import type {
  ActivityItem,
  ApiSuccess,
  ListUsersParams,
  PaginatedUsers,
  UserProfile,
  UserRole,
  UserSettings,
  UserStatus,
} from '../types'

/**
 * Users service — thin wrappers around the backend Users module endpoints.
 */

/* ------------------------------ Current user ------------------------------ */

export async function getProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<ApiSuccess<UserProfile>>('/users/profile')
  return data.data
}

export async function updateProfile(
  payload: Partial<Pick<UserProfile, 'fullName' | 'phone' | 'bio'>>
): Promise<UserProfile> {
  const { data } = await apiClient.put<ApiSuccess<UserProfile>>(
    '/users/profile',
    payload
  )
  return data.data
}

export async function updateAvatar(avatar: string): Promise<UserProfile> {
  const { data } = await apiClient.put<ApiSuccess<UserProfile>>(
    '/users/profile/avatar',
    { avatar }
  )
  return data.data
}

export async function getSettings(): Promise<UserSettings> {
  const { data } = await apiClient.get<ApiSuccess<UserSettings>>('/users/settings')
  return data.data
}

export async function updateSettings(
  payload: Partial<UserSettings>
): Promise<UserSettings> {
  const { data } = await apiClient.put<ApiSuccess<UserSettings>>(
    '/users/settings',
    payload
  )
  return data.data
}

export async function getActivity(limit = 50): Promise<ActivityItem[]> {
  const { data } = await apiClient.get<ApiSuccess<ActivityItem[]>>(
    '/users/activity',
    { params: { limit } }
  )
  return data.data
}

/* ------------------------------- Admin: users ------------------------------ */

export async function listUsers(params: ListUsersParams = {}): Promise<PaginatedUsers> {
  const { data } = await apiClient.get<ApiSuccess<PaginatedUsers>>(
    '/users/admin/list',
    { params }
  )
  return data.data
}

export async function getUser(userId: string): Promise<UserProfile> {
  const { data } = await apiClient.get<ApiSuccess<UserProfile>>(
    `/users/admin/${userId}`
  )
  return data.data
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<UserProfile> {
  const { data } = await apiClient.put<ApiSuccess<UserProfile>>(
    `/users/admin/${userId}/role`,
    { role }
  )
  return data.data
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus
): Promise<UserProfile> {
  const { data } = await apiClient.put<ApiSuccess<UserProfile>>(
    `/users/admin/${userId}/status`,
    { status }
  )
  return data.data
}
