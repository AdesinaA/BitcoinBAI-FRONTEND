'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Tabs (no external primitive dependency).
 * Provides an accessible tab interface with roving tabindex and
 * arrow-key navigation, following the WAI-ARIA tabs pattern.
 */

interface TabsContextValue {
  value: string
  setValue: (value: string) => void
  registerTab: (value: string, node: HTMLButtonElement | null) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext(component: string): TabsContextValue {
  const ctx = React.useContext(TabsContext)
  if (!ctx) {
    throw new Error(`${component} must be used within <Tabs>`)
  }
  return ctx
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled active tab value. */
  value?: string
  /** Initial active tab (uncontrolled). */
  defaultValue?: string
  /** Called when the active tab changes. */
  onValueChange?: (value: string) => void
}

function Tabs({
  value: controlledValue,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? ''
  )
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const tabsRef = React.useRef<Map<string, HTMLButtonElement | null>>(new Map())

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const registerTab = React.useCallback(
    (tabValue: string, node: HTMLButtonElement | null) => {
      if (node) tabsRef.current.set(tabValue, node)
      else tabsRef.current.delete(tabValue)
    },
    []
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(event.key)) return
    const order = Array.from(tabsRef.current.keys())
    if (order.length === 0) return
    event.preventDefault()
    const currentIndex = order.indexOf(value)
    let nextIndex = currentIndex
    if (event.key === 'ArrowRight')
      nextIndex = (currentIndex + 1) % order.length
    if (event.key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + order.length) % order.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = order.length - 1
    const nextValue = order[nextIndex]
    if (nextValue !== undefined) {
      setValue(nextValue)
      tabsRef.current.get(nextValue)?.focus()
    }
  }

  return (
    <TabsContext.Provider value={{ value, setValue, registerTab }}>
      <div className={cn('w-full', className)} onKeyDown={onKeyDown} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="tablist"
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unique value identifying this tab. */
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, id, onClick, ...props }, ref) => {
    const {
      value: activeValue,
      setValue,
      registerTab,
    } = useTabsContext('TabsTrigger')
    const selected = activeValue === value
    const triggerId = id ?? `tab-${value}`
    const panelId = `tabpanel-${value}`

    const setRefs = (node: HTMLButtonElement | null) => {
      registerTab(value, node)
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    return (
      <button
        ref={setRefs}
        id={triggerId}
        role="tab"
        type="button"
        aria-selected={selected}
        aria-controls={panelId}
        tabIndex={selected ? 0 : -1}
        data-state={selected ? 'active' : 'inactive'}
        onClick={(e) => {
          setValue(value)
          onClick?.(e)
        }}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
          className
        )}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value of the tab this content belongs to. */
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, id, ...props }, ref) => {
    const { value: activeValue } = useTabsContext('TabsContent')
    const selected = activeValue === value
    const panelId = id ?? `tabpanel-${value}`
    const triggerId = `tab-${value}`

    if (!selected) return null

    return (
      <div
        ref={ref}
        id={panelId}
        role="tabpanel"
        aria-labelledby={triggerId}
        data-state={selected ? 'active' : 'inactive'}
        className={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      />
    )
  }
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
