'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff } from 'lucide-react'

import { useZodForm } from '@/lib/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { loginSchema, type LoginValues } from '@/features/auth/validations/auth-schemas'
import { FloatingBitcoin } from '@/components/shared/floating-bitcoin'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const login = useAuthStore((s) => s.login)
  const [isPending, setIsPending] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useZodForm(loginSchema, {
    defaultValues: { emailOrUsername: '', password: '' },
  })

  async function onSubmit(values: LoginValues) {
    setIsPending(true)
    try {
      const user = await login(values)
      toast({ title: 'Welcome back', description: `Signed in as ${user.username}.` })
      router.push(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description: getApiErrorMessage(error, 'Invalid credentials.'),
        variant: 'destructive',
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="relative overflow-hidden">
      <FloatingBitcoin count={14} seed={7} />
      <div className="container relative z-10 flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8">
            {/* Security indicator */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-elevated">
                <Shield className="h-6 w-6 text-text-tertiary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary">
                  Sign in to Bitcoin BAI
                </h1>
                <p className="text-sm text-text-secondary">
                  Your institutional Bitcoin financial platform.
                </p>
              </div>
            </div>

            {/* Login form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="emailOrUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or username</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          autoComplete="username"
                          autoFocus
                          placeholder="you@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-text-tertiary hover:text-text-primary"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...field}
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isPending}
                >
                  Sign in
                </Button>
              </form>
            </Form>

            {/* Footer */}
            <div className="text-center text-sm text-text-tertiary">
              <p>
                {`Don't have an account?`}{' '}
                <Link
                  href="/register"
                  className="font-medium text-text-primary hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      )
}
