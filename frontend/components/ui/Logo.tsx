import { cn } from '@/lib/utils'

/**
 * The "compliance seal" mark — a circular badge referencing an official GST
 * stamp, rendered in the brand blue/green pair. Used as the signature motif
 * across auth screens and the sidebar.
 */
export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="15" stroke="#1D4ED8" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="15" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="2 3" />
        <path
          d="M11 16.5L14.2 19.7L21 12.5"
          stroke="#1D4ED8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-ink dark:text-white">
          GST <span className="text-brand-blue-600">Genie</span>
        </span>
      )}
    </div>
  )
}
