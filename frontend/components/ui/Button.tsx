import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-brand-blue-600 text-white hover:bg-brand-blue-700 disabled:bg-brand-blue-300',
  secondary:
    'bg-brand-green-600 text-white hover:bg-brand-green-700 disabled:bg-brand-green-300',
  outline:
    'border border-border dark:border-border-dark bg-transparent hover:bg-surface dark:hover:bg-white/5 text-ink dark:text-slate-100',
  ghost:
    'bg-transparent hover:bg-surface dark:hover:bg-white/5 text-ink dark:text-slate-100',
}

const sizeClasses: Record<string, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
          'disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
