import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options?: SelectOption[]
  /** Native-select style children (`<option>` elements) as an alternative to `options`. */
  children?: React.ReactNode
  id?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options: optionsProp,
      children,
      value,
      defaultValue,
      placeholder = 'Select an option',
      onChange,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const options = React.useMemo<SelectOption[]>(() => {
      if (optionsProp && optionsProp.length > 0) return optionsProp
      const parsed: SelectOption[] = []
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          const optionProps =
            child.props as React.OptionHTMLAttributes<HTMLOptionElement>
          const optionValue = String(optionProps.value ?? '')
          parsed.push({
            value: optionValue,
            label:
              typeof optionProps.children === 'string'
                ? optionProps.children.trim()
                : String(optionProps.children ?? optionValue),
            disabled: optionProps.disabled,
          })
        }
      })
      return parsed
    }, [optionsProp, children])

    return (
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            'relative flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-surface px-3 py-2 text-left text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-dropdown w-full overflow-hidden rounded-md border border-border bg-surface text-sm shadow-lg focus:outline-none"
            position="popper"
          >
            <SelectPrimitive.ScrollUpButton className="flex h-6 cursor-default items-center justify-center">
              <ChevronDown className="h-4 w-4" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="max-h-60 overflow-auto p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'relative flex cursor-pointer select-none items-center justify-between rounded px-3 py-2',
                    option.disabled
                      ? 'cursor-not-allowed opacity-50'
                      : 'focus:bg-accent/10 focus:text-text-primary'
                  )}
                >
                  <span className="block truncate">{option.label}</span>
                  <SelectPrimitive.ItemIndicator className="flex items-center justify-center">
                    <Check className="h-4 w-4 text-accent" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex h-6 cursor-default items-center justify-center">
              <ChevronDown className="h-4 w-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    )
  }
)
Select.displayName = 'Select'

export { Select }
