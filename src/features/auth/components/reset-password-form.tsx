'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

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
import * as authService from '../services/auth-service'
import { getApiErrorMessage } from '../utils/api-error'
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from '../validations/auth-schemas'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isPending, setIsPending] = React.useState(false)

  const token = searchParams.get('token') ?? ''

  const form = useZodForm(resetPasswordSchema, {
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(values: ResetPasswordValues) {
    setIsPending(true)
    try {
      const message = await authService.resetPassword(token, values.password)
      toast({ title: 'Password updated', description: message })
      router.push('/login')
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: getApiErrorMessage(error, 'Invalid or expired reset link.'),
        variant: 'destructive',
      })
    } finally {
      setIsPending(false)
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          This reset link is missing its token. Request a new password reset
          link to continue.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/forgot-password">Request new link</Link>
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="gold" className="w-full" isLoading={isPending}>
          Reset password
        </Button>
      </form>
    </Form>
  )
}
