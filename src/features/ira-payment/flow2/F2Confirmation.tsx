import { useNavigate } from 'react-router-dom'
import { useFlow2 } from './Flow2Layout'
import { CheckCircle, Download, ArrowRight, Home } from 'lucide-react'
import { useFeedbackStore } from '@/core/store/feedbackStore'

export default function F2Confirmation() {
  const navigate = useNavigate()
  const { data } = useFlow2()
  const setFeedbackOpen = useFeedbackStore((s) => s.setModalOpen)

  const refNum = `QP-${Date.now().toString().slice(-8)}`
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/20 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="absolute -inset-2 rounded-full border-2 border-emerald-200 dark:border-emerald-700 animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">Contribution Executed!</h2>
        <p className="text-3xl font-black text-[var(--text-primary)] my-3">${(data.amount || 0).toLocaleString()}.00</p>
        <p className="text-sm text-emerald-600 dark:text-emerald-500">
          Successfully contributed to your {data.contributionYear || '2025'} Traditional IRA
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Transaction Details</h3>
        </div>
        <div className="divide-y divide-[var(--border-default)]">
          {[
            { label: 'Reference', value: refNum, mono: true },
            { label: 'Amount', value: `$${(data.amount || 0).toLocaleString()}.00`, bold: true },
            { label: 'Tax Year', value: `${data.contributionYear || '2025'} IRA` },
            { label: 'From Account', value: `${data.bankName || 'Chase Bank'} ···${data.accountLast4 || '1234'}` },
            { label: 'Date', value: today },
            { label: 'Settlement', value: '1-3 Business Days' },
            { label: 'Remaining Limit', value: `$${Math.max(0, 1500 - (data.amount || 0)).toLocaleString()}.00`, color: 'text-emerald-500' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-6 py-3.5">
              <span className="text-sm text-[var(--text-secondary)]">{row.label}</span>
              <span className={`text-sm ${row.bold ? 'font-bold text-[var(--text-primary)]' : row.color || 'font-medium text-[var(--text-primary)]'} ${row.mono ? 'font-mono text-xs' : ''}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">How was this experience?</p>
          <p className="text-xs text-[var(--text-secondary)]">Rate the Quick IRA Contribution flow.</p>
        </div>
        <button onClick={() => setFeedbackOpen(true)} className="btn-brand px-4 py-2 rounded-lg text-xs font-semibold shrink-0">
          Give Feedback
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          <Download className="h-4 w-4" />
          Download Receipt
        </button>
        <button onClick={() => navigate('/ira-payment')} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          <ArrowRight className="h-4 w-4" />
          New Payment
        </button>
        <button onClick={() => navigate('/dashboard')} className="flex-1 btn-brand flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold">
          <Home className="h-4 w-4" />
          Dashboard
        </button>
      </div>
    </div>
  )
}
