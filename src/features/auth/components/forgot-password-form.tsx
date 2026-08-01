'use client'

import * as React from 'react'

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
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from '../validations/auth-schemas'

export function ForgotPasswordForm() {
  const { toast } = useToast()
  const [isPending, setIsPending] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const form = useZodForm(forgotPasswordSchema, {
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    setIsPending(true)
    try {
      const message = await authService.forgotPassword(values)
      setSubmitted(true)
      toast({ title: 'Check your email', description: message })
    } catch (error) {
      toast({
        title: 'Request failed',
        description: getApiErrorMessage(error, 'Could not process your request.'),
        variant: 'destructive',
      })
    } finally {
      setIsPending(false)
    }
  }

  if (submitted) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        If an account exists for that email, a password reset link has been
        sent. Please check your inbox.
      </p>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="gold" className="w-full" isLoading={isPending}>
          Send reset link
        </Button>
      </form>
    </Form>
  )
}
