import { AxiosError } from 'axios'

/**
 * Extract a human-readable message from an API error response.
 * Handles both the standard API error envelope ({ success, message })
 * and the global exception-filter shape ({ message }), falling back to
 * a generic message.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong'
): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as
      | { message?: string | string[] }
      | undefined
    const message = body?.message
    if (Array.isArray(message)) return message[0] ?? fallback
    if (typeof message === 'string' && message.length > 0) return message
    if (error.message) return error.message
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

/** Regex to match the "not in binary network" condition (case-insensitive). */
const NOT_IN_BINARY_RE = /not in binary network/i

/**
 * Whether an API error represents the "user has not yet been placed in the
 * binary network" condition — an expected, informational state rather than a
 * genuine failure that warrants a destructive toast.
 *
 * Checks for a machine-readable `code` field first (emitted by the backend
 * exception filter when the binary service throws a `NotFoundException`
 * with `{ code: 'NOT_IN_BINARY_NETWORK' }`), then falls back to matching
 * the human-readable message string (case-insensitive) for backward
 * compatibility and resilience against error-wrapping interceptors.
 */
export function isNotInBinaryNetworkError(error: unknown): boolean {
  // AxiosError: inspect the HTTP response body.
  if (error instanceof AxiosError) {
    const body = error.response?.data as
      | { code?: string; message?: string | string[] }
      | undefined

    // 1. Machine-readable code — preferred path.
    if (body?.code === 'NOT_IN_BINARY_NETWORK') return true

    // 2. Human-readable message — case-insensitive fallback.
    const message = body?.message
    if (Array.isArray(message)) return NOT_IN_BINARY_RE.test(message[0] ?? '')
    if (typeof message === 'string') return NOT_IN_BINARY_RE.test(message)

    // 3. Axios error message (e.g. "Request failed with status code 404").
    if (typeof error.message === 'string' && NOT_IN_BINARY_RE.test(error.message))
      return true
  }

  // Non-AxiosError: e.g. a thrown string or plain Error.
  if (error instanceof Error && NOT_IN_BINARY_RE.test(error.message)) return true
  if (typeof error === 'string' && NOT_IN_BINARY_RE.test(error)) return true

  return false
}
