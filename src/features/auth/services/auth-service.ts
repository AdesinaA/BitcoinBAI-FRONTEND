import { apiClient } from '@/lib/api-client'
import type {
  ApiSuccess,
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
} from '../types'
import type {
  ForgotPasswordValues,
  LoginValues,
  RegisterValues,
} from '../validations/auth-schemas'

/**
 * Auth service — thin wrappers around the backend auth endpoints.
 * Each returns the unwrapped `data` payload from the API envelope.
 */

export async function login(values: LoginValues): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiSuccess<LoginResponse>>(
    '/auth/login',
    values
  )
  return data.data
}

export async function register(
  values: Omit<RegisterValues, 'confirmPassword'>
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<ApiSuccess<RegisterResponse>>(
    '/auth/register',
    values
  )
  return data.data
}

export async function refreshToken(
  token: string
): Promise<RefreshResponse> {
  const { data } = await apiClient.post<ApiSuccess<RefreshResponse>>(
    '/auth/refresh',
    { refreshToken: token }
  )
  return data.data
}

export async function logout(refreshTokenValue: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken: refreshTokenValue })
}

export async function forgotPassword(
  values: ForgotPasswordValues
): Promise<string> {
  const { data } = await apiClient.post<ApiSuccess<null>>(
    '/auth/forgot-password',
    values
  )
  return data.message
}

export async function resetPassword(
  token: string,
  password: string
): Promise<string> {
  const { data } = await apiClient.post<ApiSuccess<null>>(
    '/auth/reset-password',
    { token, password }
  )
  return data.message
}

export async function verifyEmail(token: string): Promise<string> {
  const { data } = await apiClient.post<ApiSuccess<unknown>>(
    '/auth/verify-email',
    { token }
  )
  return data.message
}
