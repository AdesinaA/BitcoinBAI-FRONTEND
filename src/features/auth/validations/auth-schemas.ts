import { z } from '@/lib/form'

/**
 * Auth form validation schemas (Zod).
 * These mirror the backend DTO rules (docs/06_API_SPECIFICATION.md §4)
 * so client-side and server-side validation stay in sync. Kept local to
 * the frontend because the shared package is not resolvable at runtime.
 */

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(USERNAME_REGEX, 'Only letters, numbers, and underscores are allowed')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(
    PASSWORD_REGEX,
    'Must include uppercase, lowercase, number, and special character'
  )

export const emailSchema = z.string().email('Enter a valid email address')

/** Login — identifier may be an email or a username. */
export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginValues = z.infer<typeof loginSchema>

/** Register. */
export const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required').max(100),
    username: usernameSchema,
    email: emailSchema,
    phone: z
      .string()
      .regex(PHONE_REGEX, 'Enter a valid phone number')
      .optional()
      .or(z.literal('')),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    referralCode: z.string().optional().or(z.literal('')),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type RegisterValues = z.infer<typeof registerSchema>

/** Forgot password — request a reset link. */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

/** Reset password — set a new password using the emailed token. */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
