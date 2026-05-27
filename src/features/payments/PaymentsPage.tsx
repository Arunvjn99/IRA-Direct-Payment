import { useNavigate } from 'react-router-dom'
import { usePaymentsStore, type Payment } from '@/core/store/paymentsStore'
import {
  Plus, CheckCircle, Clock, XCircle, CreditCard,
  ChevronRight, Download, DollarSign, TrendingUp,
} from 'lucide-react'

const IRS_LIMITS: Record<string, number> = {
  '2023': 6500,
  '2024': 7000,
  '2025': 7000,
}

const STATUS_CONFIG = {
  Success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400' },
  Pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400' },
  Failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400' },
}

function StatusBadge({ status }: { status: Payment['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <cfg.icon className={`h-3 w-3 ${cfg.color}`} />
      {status}
    </span>
  )
}

export default function PaymentsPage() {
  const navigate = useNavigate()
  const payments = usePaymentsStore((s) => s.payments)

  // YTD totals by year
  const ytd2025 = payments.filter(p => p.taxYear === '2025' && p.status === 'Success').reduce((a, p) => a + p.amount, 0)
  const ytd2024 = payments.filter(p => p.taxYear === '2024' && p.status === 'Success').reduce((a, p) => a + p.amount, 0)
  const limit2025 = IRS_LIMITS['2025']
  const remaining2025 = Math.max(0, limit2025 - ytd2025)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Payments</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            IRA Direct Contributions — manage and track your payments
          </p>
        </div>
        <button
          onClick={() => navigate('/payments/new')}
          className="btn-brand flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Payment
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium">2025 Contributed</p>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">${ytd2025.toLocaleString()}</p>
          <div className="mt-2 h-1.5 bg-[var(--border-default)] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((ytd2025 / limit2025) * 100, 100)}%`, background: 'var(--color-primary)' }} />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1.5">of $7,000 limit</p>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium">2025 Remaining</p>
          </div>
          <p className="text-2xl font-bold text-emerald-500">${remaining2025.toLocaleString()}</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">Available to contribute this year</p>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium">2024 Contributed</p>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">${ytd2024.toLocaleString()}</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">of $7,000 limit for 2024</p>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Payment History</h2>
          <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-default)] rounded-lg px-3 py-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>

        {payments.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">No payments yet</p>
            <p className="text-xs text-[var(--text-muted)] mb-4">Make your first IRA contribution to get started.</p>
            <button onClick={() => navigate('/payments/new')} className="btn-brand px-5 py-2 rounded-xl text-sm font-semibold">
              Make First Payment
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--surface-elevated)]">
                    {['Date', 'Tax Year', 'Amount', 'Payment Method', 'Transaction ID', 'Status', ''].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">{p.date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400">
                          {p.taxYear} IRA
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[var(--text-primary)] whitespace-nowrap">
                        ${p.amount.toLocaleString()}.00
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded bg-[var(--surface-elevated)] flex items-center justify-center">
                            <CreditCard className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-[var(--text-primary)]">Authorize.net</p>
                            {p.cardType && p.accountLastFour && (
                              <p className="text-xs text-[var(--text-muted)]">{p.cardType} ···{p.accountLastFour}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-[var(--text-muted)]">{p.transactionId}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-[var(--border-default)]">
              {payments.map((p) => (
                <div key={p.id} className="px-4 py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--text-primary)]">${p.amount.toLocaleString()}.00</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>{p.taxYear} IRA · {p.date}</span>
                    <span className="font-mono">{p.transactionId}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">Authorize.net · {p.cardType} ···{p.accountLastFour}</p>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-[var(--border-default)] bg-[var(--surface-elevated)] flex items-center justify-between">
              <p className="text-xs text-[var(--text-muted)]">{payments.length} payment{payments.length !== 1 ? 's' : ''} total</p>
              <button onClick={() => navigate('/payments/new')} className="btn-brand flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold">
                <Plus className="h-3.5 w-3.5" />
                New Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
