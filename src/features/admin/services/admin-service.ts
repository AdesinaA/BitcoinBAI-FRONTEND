import { apiClient } from '@/lib/api-client'
import type {
  AdminHealth,
  AdminMetrics,
  AdminStatistics,
  ApiSuccess,
  CreditWalletPayload,
  CreditWalletResult,
  ListAuditLogsParams,
  ListUsersParams,
  ListWithdrawalsParams,
  PaginatedAuditLogs,
  PaginatedUsers,
  PaginatedWithdrawals,
  SettingItem,
  UpdateSettingPayload,
  WalletsOverview,
} from '../types'

/**
 * Admin service — thin wrappers around the backend Admin module endpoints.
 * All paths are relative to the apiClient baseURL. The AdminController is
 * mounted at /admin and the SettingsController at /settings.
 */

/* ------------------------------ Platform metrics -------------------------- */

export async function getMetrics(): Promise<AdminMetrics> {
  const { data } = await apiClient.get<ApiSuccess<AdminMetrics>>(
    '/admin/metrics'
  )
  return data.data
}

export async function getStatistics(): Promise<AdminStatistics> {
  const { data } = await apiClient.get<ApiSuccess<AdminStatistics>>(
    '/admin/statistics'
  )
  return data.data
}

/* ------------------------------ Withdrawal queue -------------------------- */

export async function listWithdrawals(
  params: ListWithdrawalsParams = {}
): Promise<PaginatedWithdrawals> {
  const { data } = await apiClient.get<ApiSuccess<PaginatedWithdrawals>>(
    '/admin/withdrawals',
    { params }
  )
  return data.data
}

export async function getWithdrawal(withdrawalId: string) {
  const { data } = await apiClient.get<ApiSuccess<unknown>>(
    `/admin/withdrawals/${withdrawalId}`
  )
  return data.data
}

export async function approveWithdrawal(withdrawalId: string) {
  const { data } = await apiClient.post<ApiSuccess<unknown>>(
    `/admin/withdrawals/${withdrawalId}/approve`
  )
  return data.data
}

export interface RejectWithdrawalPayload {
  reason: string
}

export async function rejectWithdrawal(
  withdrawalId: string,
  payload: RejectWithdrawalPayload
) {
  const { data } = await apiClient.post<ApiSuccess<unknown>>(
    `/admin/withdrawals/${withdrawalId}/reject`,
    payload
  )
  return data.data
}

/* --------------------------- Wallet operations ---------------------------- */

export async function creditWallet(
  payload: CreditWalletPayload
): Promise<CreditWalletResult> {
  const { data } = await apiClient.post<ApiSuccess<CreditWalletResult>>(
    `/admin/wallets/credit`,
    { email: payload.email, amount: payload.amount, description: payload.description }
  )
  return data.data
}

export async function getWalletsOverview(): Promise<WalletsOverview> {
  const { data } = await apiClient.get<ApiSuccess<WalletsOverview>>(
    '/admin/wallets/overview'
  )
  return data.data
}

/* -------------------------------- Audit logs ------------------------------ */

export async function listAuditLogs(
  params: ListAuditLogsParams = {}
): Promise<PaginatedAuditLogs> {
  const { data } = await apiClient.get<ApiSuccess<PaginatedAuditLogs>>(
    '/admin/audit-logs',
    { params }
  )
  return data.data
}

/* -------------------------------- Settings -------------------------------- */

export async function listSettings(): Promise<SettingItem[]> {
  const { data } = await apiClient.get<ApiSuccess<SettingItem[]>>('/settings')
  return data.data
}

export async function getSetting(key: string): Promise<SettingItem> {
  const { data } = await apiClient.get<ApiSuccess<SettingItem>>(
    `/settings/${key}`
  )
  return data.data
}

export async function updateSetting(
  key: string,
  payload: UpdateSettingPayload
): Promise<SettingItem> {
  const { data } = await apiClient.put<ApiSuccess<SettingItem>>(
    `/settings/${key}`,
    payload
  )
  return data.data
}

export async function createSetting(payload: {
  category: string
  key: string
  value: unknown
}): Promise<SettingItem> {
  const { data } = await apiClient.post<ApiSuccess<SettingItem>>(
    '/settings',
    payload
  )
  return data.data
}

export async function deleteSetting(key: string): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiSuccess<{ deleted: boolean }>>(
    `/settings/${key}`
  )
  return data.data
}

/* --------------------------------- Health --------------------------------- */

export async function getHealth(): Promise<AdminHealth> {
  const { data } = await apiClient.get<ApiSuccess<AdminHealth>>(
    '/admin/health'
  )
  return data.data
}

/* ---------------------------------- Users --------------------------------- */

export async function listUsers(
  params: ListUsersParams = {}
): Promise<PaginatedUsers> {
  const { data } = await apiClient.get<ApiSuccess<PaginatedUsers>>(
    '/users/admin/list',
    { params }
  )
  return data.data
}
