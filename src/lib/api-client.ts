import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

const ACCESS_TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'

/** Paths that must NOT trigger the refresh-token flow on 401. */
const AUTH_PATHS = ['/auth/login', '/auth/refresh', '/auth/register']

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

function setAccessToken(token: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* --------------------------- Token refresh (401) --------------------------- */

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let refreshPromise: Promise<string> | null = null

/**
 * Request a new access token using the stored refresh token.
 * Concurrent 401s share a single in-flight refresh request.
 */
async function requestNewAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      return Promise.reject(new Error('No refresh token available'))
    }
    refreshPromise = axios
      .post<{ data: { accessToken: string } }>(
        `${apiClient.defaults.baseURL}/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((res) => {
        const accessToken = res.data.data.accessToken
        setAccessToken(accessToken)
        return accessToken
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

function clearSessionAndRedirect() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  window.localStorage.removeItem('bai-auth')
  window.location.href = '/login'
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableRequest | undefined
    const status = error.response?.status

    // Only attempt a refresh once per request, for 401s on non-auth paths.
    if (
      status === 401 &&
      original &&
      !original._retry &&
      !AUTH_PATHS.some((p) => original.url?.includes(p))
    ) {
      original._retry = true
      try {
        const accessToken = await requestNewAccessToken()
        original.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(original as AxiosRequestConfig)
      } catch (refreshError) {
        clearSessionAndRedirect()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
