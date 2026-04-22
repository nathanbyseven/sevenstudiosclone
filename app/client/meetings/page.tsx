// app/client/meetings/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { VideoCamera, Clock, ArrowSquareOut } from '@phosphor-icons/react/dist/ssr'
import MeetingCard from '@/components/portal/MeetingCard'

export const dynamic = 'force-dynamic'

export default async function MeetingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: meetings } = await supabase
    .from('meetings')
    .select('*')
    .eq('client_id', user.id)
    .order('meeting_date', { ascending: false })

  return (
    <div className="flex flex-col gap-8">
      <div className="animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
        <p className="text-[10px] uppercase tracking-[0.22em] text-brand-muted mb-2">Meetings</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">Meeting Notes</h1>
        <p className="text-sm text-brand-muted mt-2">A record of all sessions with your Seven Studios team.</p>
      </div>

      {(!meetings || meetings.length === 0) ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <VideoCamera size={32} className="text-brand-muted/30" />
          <p className="text-sm text-brand-muted max-w-[40ch] leading-relaxed">
            No meetings recorded yet. Notes will appear here after your sessions.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 animate-fade-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
          {meetings.map((meeting, i) => (
            <MeetingCard key={meeting.id} meeting={meeting} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
