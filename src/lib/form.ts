import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormProps, type FieldValues } from 'react-hook-form'
import { z } from 'zod'

/**
 * Central React Hook Form + Zod integration.
 *
 * Use `useZodForm` to get a fully-typed form instance whose resolver is
 * wired to a Zod schema. This guarantees validation and inference stay in
 * sync across the entire app.
 */

export function useZodForm<TSchema extends z.ZodType<FieldValues>>(
  schema: TSchema,
  props?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
) {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    ...props,
  })
}

export { z, zodResolver }
