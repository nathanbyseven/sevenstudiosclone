'use client'
// components/portal/PortalTopBar.tsx

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, X, SquaresFour, CalendarDots, VideoCamera, Receipt, FolderOpen } from '@phosphor-icons/react'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['client_profiles']['Row'] | null

const NAV = [
  { href: '/client',           label: 'Overview',   icon: SquaresFour  },
  { href: '/client/timeline',  label: 'Timeline',   icon: CalendarDots },
  { href: '/client/meetings',  label: 'Meetings',   icon: VideoCamera  },
  { href: '/client/invoices',  label: 'Invoices',   icon: Receipt      },
  { href: '/client/documents', label: 'Documents',  icon: FolderOpen   },
]

const ROUTE_LABELS: Record<string, string> = {
  '/client':           'Overview',
  '/client/timeline':  'Timeline',
  '/client/meetings':  'Meetings',
  '/client/invoices':  'Invoices',
  '/client/documents': 'Documents',
}

export default function PortalTopBar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentLabel = ROUTE_LABELS[pathname] ?? 'Portal'

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-brand-border
                         bg-black/80 backdrop-blur-md px-5 md:px-8 lg:px-10
                         h-14 flex items-center justify-between shrink-0">
        {/* Breadcrumb / page title */}
        <div className="flex items-center gap-2">
          <span className="text-brand-muted text-xs hidden sm:inline">Seven Studios</span>
          <span className="text-brand-muted/40 text-xs hidden sm:inline">/</span>
          <span className="text-sm font-medium">{currentLabel}</span>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen(v => !v)}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg
                     border border-brand-border text-brand-muted hover:text-white
                     transition-colors duration-150"
        >
          {mobileOpen ? <X size={16} /> : <List size={16} />}
        </button>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/95 backdrop-blur-xl"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute top-14 left-0 right-0 bottom-0 flex flex-col p-6 gap-1"
            onClick={e => e.stopPropagation()}
          >
            {/* Client info */}
            <div className="pb-5 mb-2 border-b border-brand-border">
              <p className="text-xs text-brand-muted">{profile?.company ?? ''}</p>
              <p className="text-sm font-medium mt-0.5">{profile?.full_name ?? 'Client'}</p>
            </div>

            {NAV.map(({ href, label, icon: Icon }) => {
              const exact = href === '/client'
              const active = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                              transition-colors duration-150
                              ${active ? 'bg-white/[0.08] text-white' : 'text-brand-muted'}`}
                >
                  <Icon size={18} weight={active ? 'fill' : 'regular'} className={active ? 'text-brand-accent' : ''} />
                  {label}
                </Link>
              )
            })}

            <div className="mt-auto pt-5 border-t border-brand-border">
              <form action="/api/auth/signout" method="POST">
                <button type="submit" className="w-full text-left px-4 py-3 text-sm text-brand-muted">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
