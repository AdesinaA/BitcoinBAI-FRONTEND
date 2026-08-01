'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
import { useAuthStore } from '../store/auth-store'
import { getApiErrorMessage } from '../utils/api-error'
import { loginSchema, type LoginValues } from '../validations/auth-schemas'

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const login = useAuthStore((s) => s.login)
  const [isPending, setIsPending] = React.useState(false)

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                  className="text-sm text-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="gold" className="w-full" isLoading={isPending}>
          Sign in
        </Button>
      </form>
    </Form>
  )
}
