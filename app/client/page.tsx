// app/client/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  CalendarDots, VideoCamera, Receipt, FolderOpen,
  CheckCircle, Clock, ArrowRight
} from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function OverviewPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Parallel fetches for all sections
  const [
    { data: projects },
    { data: milestones },
    { data: meetings },
    { data: invoices },
    { data: documents },
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('client_id', user.id).order('created_at', { ascending: false }),
    supabase.from('milestones').select('*').eq('client_id', user.id).order('due_date', { ascending: true }),
    supabase.from('meetings').select('*').eq('client_id', user.id).order('meeting_date', { ascending: false }).limit(3),
    supabase.from('invoices').select('*').eq('client_id', user.id).order('issued_date', { ascending: false }),
    supabase.from('documents').select('*').eq('client_id', user.id).order('created_at', { ascending: false }).limit(4),
  ])

  const activeProject = projects?.find(p => p.status === 'active') ?? projects?.[0]
  const completedMilestones = milestones?.filter(m => m.completed).length ?? 0
  const totalMilestones     = milestones?.length ?? 0
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  const pendingInvoiceTotal = invoices
    ?.filter(i => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + Number(i.amount), 0) ?? 0

  const upcomingMilestone = milestones?.find(m => !m.completed)

  return (
    <div className="flex flex-col gap-8">

      {/* ── Page heading ──────────────────────────────────────── */}
      <div className="animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
        <p className="text-[10px] uppercase tracking-[0.22em] text-brand-muted mb-2">Overview</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">
          {activeProject?.name ?? 'Welcome back'}
        </h1>
        {activeProject?.description && (
          <p className="mt-2 text-sm text-brand-muted max-w-[60ch] leading-relaxed">
            {activeProject.description}
          </p>
        )}
      </div>

      {/* ── Stat cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up opacity-0 stagger-2"
           style={{ animationFillMode: 'forwards' }}>
        {[
          {
            label: 'Progress',
            value: `${progress}%`,
            sub: `${completedMilestones}/${totalMilestones} milestones`,
            href: '/client/timeline',
            accent: true,
          },
          {
            label: 'Meetings',
            value: String(meetings?.length ?? 0),
            sub: 'total recorded',
            href: '/client/meetings',
          },
          {
            label: 'Outstanding',
            value: pendingInvoiceTotal > 0
              ? `R ${pendingInvoiceTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
              : 'Settled',
            sub: 'invoice balance',
            href: '/client/invoices',
          },
          {
            label: 'Documents',
            value: String(documents?.length ?? 0),
            sub: 'available files',
            href: '/client/documents',
          },
        ].map(({ label, value, sub, href, accent }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col justify-between p-5 rounded-2xl
                       border border-brand-border bg-brand-subtle
                       hover:border-brand-border/60 hover:bg-white/[0.07]
                       transition-all duration-200 ease-out-expo min-h-[110px]
                       active:scale-[0.98]"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-brand-muted">{label}</p>
            <div>
              <p className={`text-2xl font-light tracking-tight mt-1 ${accent ? 'text-brand-accent' : 'text-white'}`}>
                {value}
              </p>
              <p className="text-xs text-brand-muted mt-0.5">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Progress bar ──────────────────────────────────────── */}
      {totalMilestones > 0 && (
        <div className="animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-brand-muted">Project progress</p>
            <p className="text-xs text-brand-muted">{progress}%</p>
          </div>
          <div className="h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-accent rounded-full transition-all duration-1000 ease-in-out-strong"
              style={{ width: `${progress}%` }}
            />
          </div>
          {upcomingMilestone && (
            <p className="text-xs text-brand-muted mt-2">
              Next: <span className="text-white/70">{upcomingMilestone.title}</span>
              {upcomingMilestone.due_date && (
                <span> — due {format(new Date(upcomingMilestone.due_date), 'dd MMM yyyy')}</span>
              )}
            </p>
          )}
        </div>
      )}

      {/* ── Two column: meetings + invoices ───────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-up opacity-0 stagger-4"
           style={{ animationFillMode: 'forwards' }}>

        {/* Recent meetings */}
        <div className="rounded-2xl border border-brand-border bg-brand-subtle p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <VideoCamera size={14} className="text-brand-muted" />
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-muted">Recent Meetings</p>
            </div>
            <Link href="/client/meetings" className="text-[11px] text-brand-muted hover:text-white transition-colors flex items-center gap-1">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          {meetings && meetings.length > 0 ? (
            <div className="flex flex-col divide-y divide-brand-border">
              {meetings.map(m => (
                <div key={m.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-sm font-medium text-white/90 truncate">{m.title}</p>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {format(new Date(m.meeting_date), 'dd MMM yyyy')}
                    {m.duration_min ? ` · ${m.duration_min} min` : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<VideoCamera size={20} className="text-brand-muted/40" />} text="No meetings recorded yet." />
          )}
        </div>

        {/* Invoices summary */}
        <div className="rounded-2xl border border-brand-border bg-brand-subtle p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Receipt size={14} className="text-brand-muted" />
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-muted">Invoices</p>
            </div>
            <Link href="/client/invoices" className="text-[11px] text-brand-muted hover:text-white transition-colors flex items-center gap-1">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          {invoices && invoices.length > 0 ? (
            <div className="flex flex-col divide-y divide-brand-border">
              {invoices.slice(0, 3).map(inv => (
                <div key={inv.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate">{inv.title}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{inv.invoice_number}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <p className="text-sm font-medium">
                      R {Number(inv.amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </p>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Receipt size={20} className="text-brand-muted/40" />} text="No invoices yet." />
          )}
        </div>
      </div>

      {/* ── Recent documents ──────────────────────────────────── */}
      <div className="animate-fade-up opacity-0 stagger-5" style={{ animationFillMode: 'forwards' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen size={14} className="text-brand-muted" />
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-muted">Recent Documents</p>
          </div>
          <Link href="/client/documents" className="text-[11px] text-brand-muted hover:text-white transition-colors flex items-center gap-1">
            View all <ArrowRight size={10} />
          </Link>
        </div>
        {documents && documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map(doc => (
              <div key={doc.id}
                   className="flex items-center gap-3 p-4 rounded-xl border border-brand-border
                              bg-brand-subtle hover:bg-white/[0.06] transition-colors duration-150">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                  <FolderOpen size={14} className="text-brand-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-brand-muted capitalize">{doc.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-border bg-brand-subtle p-8">
            <EmptyState icon={<FolderOpen size={20} className="text-brand-muted/40" />} text="No documents shared yet." />
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center">
      {icon}
      <p className="text-xs text-brand-muted/60">{text}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid:    'text-emerald-400 bg-emerald-400/10',
    pending: 'text-amber-400  bg-amber-400/10',
    overdue: 'text-red-400    bg-red-400/10',
    draft:   'text-brand-muted bg-white/[0.05]',
  }
  return (
    <span className={`text-[10px] font-medium capitalize px-2 py-0.5 rounded-full ${map[status] ?? map.draft}`}>
      {status}
    </span>
  )
}
