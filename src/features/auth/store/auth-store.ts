import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import * as authService from '../services/auth-service'
import type { AuthUser } from '../types'
import type { LoginValues, RegisterValues } from '../validations/auth-schemas'

/**
 * Client-side authentication session state.
 * Holds the authenticated user + JWT tokens and keeps them in sync with
 * localStorage so the axios `apiClient` Authorization interceptor
 * (which reads `localStorage.token`) always has the latest access token.
 */

const ACCESS_TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'

function persistTokens(accessToken: string, refreshToken: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

function clearTokens() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  /** True once the persisted session has been rehydrated on the client. */
  isAuthenticated: boolean

  login: (values: LoginValues) => Promise<AuthUser>
  logout: () => Promise<void>
  /** Set/replace the session (used after refresh). */
  setSession: (session: {
    user: AuthUser
    accessToken: string
    refreshToken: string
  }) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      async login(values) {
        const data = await authService.login(values)
        persistTokens(data.accessToken, data.refreshToken)
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        })
        return data.user
      },

      async logout() {
        const refreshToken = get().refreshToken
        try {
          if (refreshToken) {
            await authService.logout(refreshToken)
          }
        } catch {
          // Best-effort server logout; always clear the local session.
        } finally {
          clearTokens()
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          })
        }
      },

      setSession({ user, accessToken, refreshToken }) {
        persistTokens(accessToken, refreshToken)
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      },

      clear() {
        clearTokens()
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'bai-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

/** Type helper for register payloads (excludes confirmPassword). */
export type RegisterPayload = Omit<RegisterValues, 'confirmPassword'>
