// app/client/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalSidebar from '@/components/portal/PortalSidebar'
import PortalTopBar from '@/components/portal/PortalTopBar'

export const metadata = {
  title: 'Dashboard — Seven Studios Client Portal',
  robots: { index: false, follow: false },
}

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    // portal-root scopes all portal CSS variables and Tailwind styles
    // away from the homepage. The homepage never renders this layout.
    <div className="portal-root flex min-h-[100dvh] bg-black text-white antialiased">
      <div id="noise" aria-hidden="true" />

      {/* Sidebar — desktop */}
      <PortalSidebar profile={profile} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <PortalTopBar profile={profile} />
        <main className="flex-1 px-5 pb-12 pt-6 md:px-8 lg:px-10 max-w-[1200px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
