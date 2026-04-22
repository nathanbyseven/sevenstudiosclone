// app/client/invoices/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { Receipt, ArrowSquareOut } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue'

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  paid:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  pending: 'text-amber-400  bg-amber-400/10  border-amber-400/20',
  overdue: 'text-red-400    bg-red-400/10    border-red-400/20',
  draft:   'text-brand-muted bg-white/[0.05] border-brand-border',
}

export default async function InvoicesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', user.id)
    .order('issued_date', { ascending: false })

  const totalPaid    = invoices?.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0) ?? 0
  const totalPending = invoices?.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((s, i) => s + Number(i.amount), 0) ?? 0
  const totalAll     = invoices?.reduce((s, i) => s + Number(i.amount), 0) ?? 0

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div className="animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
        <p className="text-[10px] uppercase tracking-[0.22em] text-brand-muted mb-2">Invoices</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">Billing Overview</h1>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-up opacity-0 stagger-2"
           style={{ animationFillMode: 'forwards' }}>
        {[
          { label: 'Total Invoiced', value: totalAll,     color: 'text-white'         },
          { label: 'Paid',           value: totalPaid,    color: 'text-emerald-400'    },
          { label: 'Outstanding',    value: totalPending, color: 'text-amber-400'      },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-5 rounded-2xl border border-brand-border bg-brand-subtle">
            <p className="text-[10px] uppercase tracking-[0.18em] text-brand-muted mb-2">{label}</p>
            <p className={`text-2xl font-light tracking-tight ${color}`}>
              R {value.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      {/* Invoice list */}
      {(!invoices || invoices.length === 0) ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Receipt size={32} className="text-brand-muted/30" />
          <p className="text-sm text-brand-muted">No invoices issued yet.</p>
        </div>
      ) : (
        <div className="animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
          {/* Desktop table */}
          <div className="hidden sm:block rounded-2xl border border-brand-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-white/[0.03]">
                  {['Invoice', 'Description', 'Issued', 'Due', 'Amount', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-brand-muted font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors duration-100">
                    <td className="px-5 py-4 font-mono text-xs text-brand-muted">{inv.invoice_number}</td>
                    <td className="px-5 py-4 max-w-[200px]">
                      <p className="font-medium truncate">{inv.title}</p>
                      {inv.notes && <p className="text-xs text-brand-muted truncate mt-0.5">{inv.notes}</p>}
                    </td>
                    <td className="px-5 py-4 text-brand-muted whitespace-nowrap">
                      {format(new Date(inv.issued_date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-5 py-4 text-brand-muted whitespace-nowrap">
                      {inv.due_date ? format(new Date(inv.due_date), 'dd MMM yyyy') : '—'}
                    </td>
                    <td className="px-5 py-4 font-medium whitespace-nowrap">
                      {inv.currency} {Number(inv.amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-medium capitalize px-2 py-1 rounded-full border
                                        ${STATUS_STYLE[inv.status as InvoiceStatus] ?? STATUS_STYLE.draft}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {inv.pdf_url && (
                        <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-1 text-[11px] text-brand-muted hover:text-white
                                      transition-colors duration-150">
                          PDF <ArrowSquareOut size={11} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden flex flex-col gap-3">
            {invoices.map(inv => (
              <div key={inv.id} className="p-5 rounded-2xl border border-brand-border bg-brand-subtle">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-medium text-sm">{inv.title}</p>
                    <p className="text-xs font-mono text-brand-muted mt-0.5">{inv.invoice_number}</p>
                  </div>
                  <span className={`text-[10px] font-medium capitalize px-2 py-1 rounded-full border shrink-0
                                    ${STATUS_STYLE[inv.status as InvoiceStatus] ?? STATUS_STYLE.draft}`}>
                    {inv.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-light text-brand-accent">
                    R {Number(inv.amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex flex-col items-end gap-0.5 text-xs text-brand-muted">
                    <span>{format(new Date(inv.issued_date), 'dd MMM yyyy')}</span>
                    {inv.due_date && <span>Due {format(new Date(inv.due_date), 'dd MMM yyyy')}</span>}
                  </div>
                </div>
                {inv.pdf_url && (
                  <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center gap-1 text-xs text-brand-muted hover:text-white transition-colors">
                    Download PDF <ArrowSquareOut size={11} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
