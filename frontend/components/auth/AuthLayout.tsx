import { ReactNode } from 'react'
import { Logo } from '@/components/ui/Logo'

const stats = [
  { label: 'Invoices made GST-ready', value: '2.4L+' },
  { label: 'Avg. time to file', value: '6 min' },
  { label: 'MSMEs onboarded', value: '18,000+' },
]

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex min-h-screen bg-surface dark:bg-surface-dark">
      {/* Form column */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Logo className="mb-10" />
          <h1 className="text-2xl font-semibold text-ink dark:text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Signature ledger panel — hidden on mobile */}
      <div className="relative hidden overflow-hidden bg-brand-blue-900 lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-ledger-lines" />
        <div className="relative flex h-full flex-col justify-between p-14">
          <div />
          <div>
            <p className="max-w-md font-display text-3xl font-medium leading-snug text-white">
              Every invoice, GSTIN, and filing deadline — tracked automatically.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-mono text-xl font-semibold text-brand-green-300 tabular-nums">{s.value}</p>
                  <p className="mt-1 text-xs text-white/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
