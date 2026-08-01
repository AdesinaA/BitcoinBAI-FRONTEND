import * as React from 'react'
import { cn } from '@/lib/utils'

export interface StepperStep {
  label: string
  description?: string
  icon?: React.ReactNode
}

export interface StepperProps {
  steps: StepperStep[]
  currentStep: number
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  className,
}: StepperProps) {
  return (
    <nav
      className={cn(
        'flex',
        orientation === 'vertical' && 'flex-col',
        className
      )}
      aria-label="Progress"
    >
      {steps.map((step, index) => {
        const isComplete = index < currentStep
        const isCurrent = index === currentStep
        const _isPending = index > currentStep

        return (
          <div
            key={index}
            className={cn(
              'flex items-start gap-3',
              orientation === 'horizontal' && 'flex-1',
              orientation === 'vertical' && index < steps.length - 1 && 'pb-8'
            )}
          >
            <div
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                isComplete
                  ? 'bg-success text-text-inverse'
                  : isCurrent
                    ? 'bg-accent text-slate-900'
                    : 'bg-surface-elevated text-text-tertiary'
              )}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {step.icon || (isComplete ? '✓' : index + 1)}
            </div>
            <div className="flex-1">
              <p
                className={cn(
                  'text-sm font-medium',
                  isComplete || isCurrent
                    ? 'text-text-primary'
                    : 'text-text-tertiary'
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-text-tertiary">
                  {step.description}
                </p>
              )}
            </div>
            {orientation === 'horizontal' && index < steps.length - 1 && (
              <div
                className={cn(
                  'absolute inset-y-0 left-6 w-1/2',
                  isComplete
                    ? 'bg-success'
                    : 'bg-surface-elevated'
                )}
                style={{ zIndex: -1 }}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
