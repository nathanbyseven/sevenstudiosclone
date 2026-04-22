// app/login/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/components/portal/LoginForm'

export const metadata = {
  title: 'Sign In — Seven Studios Client Portal',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; error?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Already logged in — send to dashboard
  if (user) redirect('/client')

  return (
    <>
      <div id="noise" aria-hidden="true" />

      <main className="min-h-[100dvh] w-full flex">
        {/* ── Left panel: branding ──────────────────────────── */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 border-r border-brand-border relative overflow-hidden">
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/3 left-1/4 w-[480px] h-[480px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #c8f542 0%, transparent 70%)' }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <img
              src="https://i.ibb.co/Fb31LWRc/ssfavicon.png"
              alt="Seven Studios"
              className="h-8 w-auto opacity-90"
            />
          </div>

          {/* Headline */}
          <div className="relative z-10 max-w-sm">
            <p className="text-[10px] uppercase tracking-[0.24em] font-medium text-brand-muted mb-6">
              Client Portal
            </p>
            <h1 className="text-4xl font-light leading-tight tracking-tight mb-6">
              Your project.<br />
              Your documents.<br />
              <span className="text-brand-accent">Your space.</span>
            </h1>
            <p className="text-sm text-brand-muted leading-relaxed max-w-[42ch]">
              Everything you need to track progress, review invoices, and access confidential files — in one place.
            </p>
          </div>

          {/* Footer note */}
          <p className="relative z-10 text-[11px] text-brand-muted tracking-wide">
            © {new Date().getFullYear()} Seven Studios®
          </p>
        </div>

        {/* ── Right panel: login form ───────────────────────── */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
          <LoginForm
            redirectTo={searchParams.redirectTo}
            initialError={searchParams.error}
          />
        </div>
      </main>
    </>
  )
}
