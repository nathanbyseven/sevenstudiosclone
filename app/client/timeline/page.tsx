// app/client/timeline/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { CheckCircle, Circle, CalendarBlank } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function TimelinePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: projects }, { data: milestones }] = await Promise.all([
    supabase.from('projects').select('*').eq('client_id', user.id).order('created_at', { ascending: false }),
    supabase.from('milestones').select('*').eq('client_id', user.id).order('due_date', { ascending: true }),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div className="animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
        <p className="text-[10px] uppercase tracking-[0.22em] text-brand-muted mb-2">Timeline</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">Project Milestones</h1>
      </div>

      {(!projects || projects.length === 0) ? (
        <EmptyPage label="No projects yet. Your Seven Studios team will populate this shortly." />
      ) : (
        projects.map((project, pi) => {
          const projectMilestones = milestones?.filter(m => m.project_id === project.id) ?? []
          const completed = projectMilestones.filter(m => m.completed).length
          const total     = projectMilestones.length
          const progress  = total > 0 ? Math.round((completed / total) * 100) : 0

          return (
            <div
              key={project.id}
              className="animate-fade-up opacity-0"
              style={{ animationFillMode: 'forwards', animationDelay: `${(pi + 2) * 60}ms` }}
            >
              {/* Project header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-medium px-2 py-0.5 rounded-full
                      ${project.status === 'active'    ? 'text-emerald-400 bg-emerald-400/10' :
                        project.status === 'completed' ? 'text-brand-muted  bg-white/[0.05]' :
                                                         'text-amber-400   bg-amber-400/10'}`}>
                      {project.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-medium">{project.name}</h2>
                  {project.description && (
                    <p className="text-sm text-brand-muted mt-1 max-w-[55ch] leading-relaxed">{project.description}</p>
                  )}
                  {(project.start_date || project.end_date) && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-brand-muted">
                      <CalendarBlank size={12} />
                      {project.start_date && format(new Date(project.start_date), 'dd MMM yyyy')}
                      {project.start_date && project.end_date && ' → '}
                      {project.end_date && format(new Date(project.end_date), 'dd MMM yyyy')}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-light text-brand-accent">{progress}%</p>
                  <p className="text-xs text-brand-muted">{completed}/{total} done</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-px bg-white/[0.08] rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-brand-accent transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Milestones timeline */}
              {projectMilestones.length === 0 ? (
                <p className="text-sm text-brand-muted py-4">No milestones added yet.</p>
              ) : (
                <div className="relative pl-6 flex flex-col gap-0">
                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-brand-border" />

                  {projectMilestones.map((ms, i) => (
                    <div key={ms.id} className="relative flex gap-4 pb-8 last:pb-0">
                      {/* Icon */}
                      <div className={`absolute left-[-21px] flex items-center justify-center
                                        w-4 h-4 rounded-full top-0.5 shrink-0
                                        ${ms.completed ? 'text-brand-accent' : 'text-brand-muted/40'}`}>
                        {ms.completed
                          ? <CheckCircle size={16} weight="fill" />
                          : <Circle size={16} weight="regular" />
                        }
                      </div>

                      {/* Content */}
                      <div className={`flex-1 transition-opacity duration-200 ${ms.completed ? 'opacity-60' : 'opacity-100'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <p className={`text-sm font-medium ${ms.completed ? 'line-through text-brand-muted' : 'text-white'}`}>
                            {ms.title}
                          </p>
                          {ms.due_date && (
                            <p className="text-xs text-brand-muted shrink-0">
                              {ms.completed && ms.completed_at
                                ? `Completed ${format(new Date(ms.completed_at), 'dd MMM yyyy')}`
                                : `Due ${format(new Date(ms.due_date), 'dd MMM yyyy')}`
                              }
                            </p>
                          )}
                        </div>
                        {ms.description && (
                          <p className="text-xs text-brand-muted mt-1 leading-relaxed">{ms.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

function EmptyPage({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <CalendarBlank size={32} className="text-brand-muted/30" />
      <p className="text-sm text-brand-muted max-w-[40ch] leading-relaxed">{label}</p>
    </div>
  )
}
