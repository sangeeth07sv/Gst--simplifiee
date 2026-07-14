import { InputHTMLAttributes, forwardRef, LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Label = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('mb-1.5 block text-sm font-medium text-ink dark:text-slate-200', className)} {...props} />
)

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          className={cn(
            'h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-ink placeholder:text-slate-400',
            'dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500',
            'transition-colors focus:border-brand-blue-500',
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-border dark:border-border-dark',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
