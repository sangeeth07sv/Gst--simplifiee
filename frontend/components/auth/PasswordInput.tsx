'use client'

import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    return (
      <div>
        <div className="relative">
          <input
            ref={ref}
            type={visible ? 'text' : 'password'}
            className={cn(
              'h-11 w-full rounded-lg border bg-white px-3.5 pr-11 text-sm text-ink placeholder:text-slate-400',
              'dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500',
              'transition-colors focus:border-brand-blue-500',
              error ? 'border-red-400 focus:border-red-500' : 'border-border dark:border-border-dark',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'
