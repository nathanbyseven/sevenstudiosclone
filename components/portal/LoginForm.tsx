'use client'
// components/portal/LoginForm.tsx

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeSlash, ArrowRight, Warning } from '@phosphor-icons/react'

interface Props {
  redirectTo?: string
  initialError?: string
}

export default function LoginForm({ redirectTo, initialError }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState(initialError ?? '')

  const destination = redirectTo || '/client'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (authError) {
        setError('Invalid email or password. Please try again.')
        return
      }

      router.push(destination)
      router.refresh()
    })
  }

  return (
    <div className="w-full max-w-[420px] animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
      {/* Mobile logo */}
      <div className="lg:hidden mb-10">
        <img
          src="https://i.ibb.co/Fb31LWRc/ssfavicon.png"
          alt="Seven Studios"
          className="h-7 w-auto opacity-90"
        />
      </div>

      <p className="text-[10px] uppercase tracking-[0.24em] font-medium text-brand-muted mb-3">
        Client Portal
      </p>
      <h2 className="text-3xl font-light tracking-tight mb-2">Sign in</h2>
      <p className="text-sm text-brand-muted mb-10">
        Use the credentials provided by your Seven Studios contact.
      </p>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 mb-6 rounded-lg border border-red-500/20 bg-red-500/08 text-red-400 text-sm">
          <Warning size={16} className="flex-shrink-0 mt-0.5" weight="fill" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-medium tracking-wide text-brand-muted uppercase">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-4 py-3 rounded-lg bg-brand-subtle border border-brand-border
                       text-sm text-white placeholder:text-brand-muted/60
                       transition-colors duration-150
                       hover:border-brand-border/70
                       focus:outline-none focus:border-brand-accent/50 focus:bg-white/[0.06]"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-xs font-medium tracking-wide text-brand-muted uppercase">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-12 rounded-lg bg-brand-subtle border border-brand-border
                         text-sm text-white placeholder:text-brand-muted/60
                         transition-colors duration-150
                         hover:border-brand-border/70
                         focus:outline-none focus:border-brand-accent/50 focus:bg-white/[0.06]"
            />
            <button
              type="button"
              aria-label={showPass ? 'Hide password' : 'Show password'}
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-muted
                         hover:text-white transition-colors duration-150"
            >
              {showPass
                ? <EyeSlash size={16} weight="regular" />
                : <Eye size={16} weight="regular" />
              }
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || !email || !password}
          className="group mt-2 flex items-center justify-between w-full
                     px-5 py-3.5 rounded-lg
                     bg-white text-black font-medium text-sm tracking-wide
                     transition-all duration-200 ease-out-expo
                     hover:bg-brand-accent
                     active:scale-[0.98]
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          <span>{isPending ? 'Signing in…' : 'Sign in'}</span>
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black/10
                           transition-transform duration-200
                           group-hover:translate-x-0.5">
            <ArrowRight size={14} weight="bold" />
          </span>
        </button>
      </form>

      <p className="mt-10 text-xs text-brand-muted/60 text-center leading-relaxed">
        Don&apos;t have access?{' '}
        <a
          href="https://thesevenstudio.co.za/#contact"
          className="text-brand-muted hover:text-white transition-colors duration-150 underline underline-offset-2"
        >
          Contact Seven Studios
        </a>
      </p>
    </div>
  )
}
