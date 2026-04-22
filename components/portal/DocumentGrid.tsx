'use client'
// components/portal/DocumentGrid.tsx

import { useState } from 'react'
import { format } from 'date-fns'
import {
  FolderOpen, DownloadSimple, ArrowClockwise,
  FileText, FileDoc, FilePdf, FileZip, FileImage, File
} from '@phosphor-icons/react'
import type { Database } from '@/lib/supabase/types'

type Document = Database['public']['Tables']['documents']['Row']

interface Props {
  grouped: Record<string, Document[] | null>
  totalCount: number
}

const CATEGORY_LABELS: Record<string, string> = {
  contract: 'Contracts',
  proposal: 'Proposals',
  brief:    'Creative Briefs',
  report:   'Reports',
  asset:    'Brand Assets',
  general:  'General Files',
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function DocIcon({ mime }: { mime: string | null }) {
  const m = mime ?? ''
  if (m.includes('pdf'))   return <FilePdf size={18} className="text-red-400" />
  if (m.includes('zip') || m.includes('compressed')) return <FileZip size={18} className="text-amber-400" />
  if (m.includes('image')) return <FileImage size={18} className="text-sky-400" />
  if (m.includes('word') || m.includes('document'))  return <FileDoc size={18} className="text-blue-400" />
  if (m.includes('text'))  return <FileText size={18} className="text-brand-muted" />
  return <File size={18} className="text-brand-muted" />
}

function DocumentRow({ doc }: { doc: Document }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function handleDownload() {
    setStatus('loading')
    try {
      const res = await fetch(`/api/documents/download?id=${doc.id}`)
      if (!res.ok) throw new Error('Failed')
      const { url, name } = await res.json()

      // Trigger browser download
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setStatus('idle')
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="group flex items-center justify-between gap-4 px-5 py-4
                    rounded-xl border border-brand-border bg-brand-subtle
                    hover:border-brand-border/60 hover:bg-white/[0.06]
                    transition-all duration-150">
      {/* Left: icon + info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
          <DocIcon mime={doc.mime_type} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/90 truncate">{doc.name}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-brand-muted">
            <span>{format(new Date(doc.created_at), 'dd MMM yyyy')}</span>
            {doc.file_size && (
              <>
                <span className="text-brand-muted/30">·</span>
                <span>{formatBytes(doc.file_size)}</span>
              </>
            )}
          </div>
          {doc.description && (
            <p className="text-xs text-brand-muted/70 mt-0.5 truncate">{doc.description}</p>
          )}
        </div>
      </div>

      {/* Right: download button */}
      <button
        onClick={handleDownload}
        disabled={status === 'loading'}
        aria-label={`Download ${doc.name}`}
        className="flex items-center gap-1.5 shrink-0
                   px-3 py-2 rounded-lg text-xs font-medium
                   border border-brand-border
                   text-brand-muted hover:text-white hover:border-brand-border/60 hover:bg-white/[0.06]
                   transition-all duration-150 ease-out
                   active:scale-[0.97]
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <ArrowClockwise size={13} className="animate-spin" />
        ) : status === 'error' ? (
          <span className="text-red-400">Failed</span>
        ) : (
          <>
            <DownloadSimple size={13} />
            <span className="hidden sm:inline">Download</span>
          </>
        )}
      </button>
    </div>
  )
}

export default function DocumentGrid({ grouped, totalCount }: Props) {
  const categories = Object.keys(grouped)

  return (
    <div className="flex flex-col gap-10 animate-fade-up opacity-0 stagger-2"
         style={{ animationFillMode: 'forwards' }}>
      {/* Total count */}
      <p className="text-xs text-brand-muted -mt-4">
        {totalCount} file{totalCount !== 1 ? 's' : ''} available
      </p>

      {categories.map((cat, ci) => (
        <section key={cat}
                 className="animate-fade-up opacity-0"
                 style={{ animationFillMode: 'forwards', animationDelay: `${ci * 60}ms` }}>
          {/* Category heading */}
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-brand-muted">
              {CATEGORY_LABELS[cat] ?? cat}
            </p>
            <span className="text-[10px] text-brand-muted/40">
              {grouped[cat]?.length}
            </span>
            <div className="flex-1 h-px bg-brand-border" />
          </div>

          <div className="flex flex-col gap-2">
            {grouped[cat]?.map(doc => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
