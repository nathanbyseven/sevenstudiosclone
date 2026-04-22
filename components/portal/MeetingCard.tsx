'use client'
// components/portal/MeetingCard.tsx

import { useState } from 'react'
import { format } from 'date-fns'
import { CaretDown, Clock, ArrowSquareOut } from '@phosphor-icons/react'
import type { Database } from '@/lib/supabase/types'

type Meeting = Database['public']['Tables']['meetings']['Row']

export default function MeetingCard({ meeting, index }: { meeting: Meeting; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)

  return (
    <div
      className="rounded-2xl border border-brand-border bg-brand-subtle overflow-hidden
                 transition-colors duration-150 hover:border-brand-border/60"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left flex items-center justify-between gap-4 px-6 py-5
                   hover:bg-white/[0.03] transition-colors duration-150"
        aria-expanded={expanded}
      >
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{meeting.title}</p>
          <div className="flex items-center gap-3 text-xs text-brand-muted flex-wrap">
            <span>{format(new Date(meeting.meeting_date), 'EEEE, dd MMM yyyy')}</span>
            {meeting.duration_min && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {meeting.duration_min} min
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {meeting.recording_url && (
            <a
              href={meeting.recording_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 text-[11px] text-brand-muted hover:text-white
                         transition-colors duration-150 underline underline-offset-2"
            >
              Recording <ArrowSquareOut size={11} />
            </a>
          )}
          <CaretDown
            size={14}
            className={`text-brand-muted transition-transform duration-200 ease-out-expo ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Expandable notes */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out-expo ${expanded ? 'max-h-[600px]' : 'max-h-0'}`}
      >
        <div className="px-6 pb-6 border-t border-brand-border pt-5">
          {meeting.notes ? (
            <div className="text-sm text-brand-muted leading-relaxed whitespace-pre-wrap">
              {meeting.notes}
            </div>
          ) : (
            <p className="text-sm text-brand-muted/50 italic">No notes recorded for this meeting.</p>
          )}
        </div>
      </div>
    </div>
  )
}
