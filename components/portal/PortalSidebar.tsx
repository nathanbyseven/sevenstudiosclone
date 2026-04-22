'use client'
// components/portal/PortalSidebar.tsx

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SquaresFour,
  CalendarDots,
  VideoCamera,
  Receipt,
  FolderOpen,
  ArrowSquareOut,
} from '@phosphor-icons/react'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['client_profiles']['Row'] | null

const NAV = [
  { href: '/client',           label: 'Overview',   icon: SquaresFour  },
  { href: '/client/timeline',  label: 'Timeline',   icon: CalendarDots },
  { href: '/client/meetings',  label: 'Meetings',   icon: VideoCamera  },
  { href: '/client/invoices',  label: 'Invoices',   icon: Receipt      },
  { href: '/client/documents', label: 'Documents',  icon: FolderOpen   },
]

export default function PortalSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-[220px] xl:w-[240px] shrink-0
                      border-r border-brand-border min-h-[100dvh] sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-brand-border">
        <Link href="https://thesevenstudio.co.za" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 group w-fit">
          <img
            src="https://i.ibb.co/Fb31LWRc/ssfavicon.png"
            alt="Seven Studios"
            className="h-6 w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-150"
          />
          <ArrowSquareOut
            size={10}
            className="text-brand-muted opacity-0 group-hover:opacity-60 transition-opacity duration-150"
          />
        </Link>
      </div>

      {/* Client name */}
      <div className="px-6 py-5 border-b border-brand-border">
        <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-1">Logged in as</p>
        <p className="text-sm font-medium truncate">{profile?.full_name ?? 'Client'}</p>
        {profile?.company && (
          <p className="text-xs text-brand-muted truncate mt-0.5">{profile.company}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }, i) => {
          const exact = href === '/client'
          const active = exact ? pathname === href : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 ease-out group
                ${active
                  ? 'bg-white/[0.08] text-white'
                  : 'text-brand-muted hover:text-white hover:bg-white/[0.04]'
                }
              `}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <Icon
                size={16}
                weight={active ? 'fill' : 'regular'}
                className={active ? 'text-brand-accent' : 'text-brand-muted group-hover:text-white/60 transition-colors duration-150'}
              />
              {label}
              {active && (
                <span className="ml-auto w-1 h-1 rounded-full bg-brand-accent opacity-80" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-brand-border">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
                       text-sm text-brand-muted hover:text-white hover:bg-white/[0.04]
                       transition-all duration-150 group"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-brand-muted group-hover:text-white/60 transition-colors">
              <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
