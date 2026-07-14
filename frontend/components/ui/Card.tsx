import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-xl2 border border-border bg-white shadow-card dark:border-border-dark dark:bg-white/[0.03]',
      className
    )}
    {...props}
  />
)
