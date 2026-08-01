/**
 * Auth API types — mirror the backend response contract
 * (docs/06_API_SPECIFICATION.md §4).
 */

export interface AuthUser {
  userId: string
  email: string
  username: string
  role: 'user' | 'admin'
  status: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface RegisterResponse {
  userId: string
  email: string
  username: string
  status: string
}

export interface RefreshResponse {
  accessToken: string
}

/** Standard API envelope returned by the backend on success. */
export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
}
