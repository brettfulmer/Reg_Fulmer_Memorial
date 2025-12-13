'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-body-sm font-medium text-foreground-muted mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 bg-background-subtle border border-border rounded-xl',
            'text-foreground placeholder:text-foreground-subtle',
            'transition-all duration-200 resize-none',
            'focus:border-accent-gold focus:ring-1 focus:ring-accent-gold focus:outline-none',
            'hover:border-foreground-subtle',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[120px]',
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

Textarea.displayName = 'Textarea'

export { Textarea }
