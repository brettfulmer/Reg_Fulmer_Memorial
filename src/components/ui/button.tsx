
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      primary: 'bg-accent-gold text-background hover:bg-accent-gold-light hover:shadow-glow-sm active:scale-[0.98]',
      secondary: 'bg-background-muted text-foreground border border-border hover:bg-background-subtle hover:border-foreground-subtle active:scale-[0.98]',
      ghost: 'bg-transparent text-foreground-muted hover:bg-background-subtle hover:text-foreground',
      danger: 'bg-error/10 text-error border border-error/20 hover:bg-error/20 active:scale-[0.98]',
    }

    const sizes = {
      sm: 'px-4 py-2 text-body-sm rounded-lg',
      md: 'px-6 py-3 text-body-md rounded-xl',
      lg: 'px-8 py-4 text-body-lg rounded-xl',
      icon: 'p-3 rounded-xl',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-sans font-medium',
          'transition-all duration-300 ease-out-expo',
          'focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
