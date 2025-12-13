'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, type = 'text', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-body-sm font-medium text-foreground-muted mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full px-4 py-3 bg-background-subtle border border-border rounded-xl',
            'text-foreground placeholder:text-foreground-subtle',
            'transition-all duration-200',
            'focus:border-accent-gold focus:ring-1 focus:ring-accent-gold focus:outline-none',
            'hover:border-foreground-subtle',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-caption text-error">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-caption text-foreground-subtle">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
