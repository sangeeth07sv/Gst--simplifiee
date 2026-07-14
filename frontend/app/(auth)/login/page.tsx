'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { Input, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { apiFetch, ApiError } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    try {
      // Backend contract: POST /auth/login -> { access_token, has_business }
      const res = await apiFetch<{ access_token: string; has_business: boolean }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify(data) }
      )
      Cookies.set('gst_genie_token', res.access_token, { expires: 7, sameSite: 'lax' })
      router.push(res.has_business ? '/dashboard' : '/onboarding')
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage invoices, expenses, and GST filing.">
      <GoogleButton />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border dark:bg-border-dark" />
        <span className="text-xs text-slate-400">or continue with email</span>
        <div className="h-px flex-1 bg-border dark:bg-border-dark" />
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@business.com" error={errors.email?.message} {...register('email')} />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="password" className="mb-0">Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-brand-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="password" autoComplete="current-password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
        </div>

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-brand-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
