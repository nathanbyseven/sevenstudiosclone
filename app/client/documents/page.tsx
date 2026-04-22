// app/client/documents/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { FolderOpen } from '@phosphor-icons/react/dist/ssr'
import DocumentGrid from '@/components/portal/DocumentGrid'

export const dynamic = 'force-dynamic'

const CATEGORY_ORDER = ['contract', 'proposal', 'brief', 'report', 'asset', 'general']

export default async function DocumentsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  // Group by category
  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof documents>>((acc, cat) => {
    const docs = documents?.filter(d => d.category === cat) ?? []
    if (docs.length > 0) acc[cat] = docs
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-8">
      <div className="animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
        <p className="text-[10px] uppercase tracking-[0.22em] text-brand-muted mb-2">Documents</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">Confidential Files</h1>
        <p className="text-sm text-brand-muted mt-2">
          All files are securely stored. Download links expire after 60 seconds.
        </p>
      </div>

      {(!documents || documents.length === 0) ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <FolderOpen size={32} className="text-brand-muted/30" />
          <p className="text-sm text-brand-muted max-w-[40ch] leading-relaxed">
            No documents shared yet. Your team will upload files as the project progresses.
          </p>
        </div>
      ) : (
        <DocumentGrid grouped={grouped} totalCount={documents?.length ?? 0} />
      )}
    </div>
  )
}
