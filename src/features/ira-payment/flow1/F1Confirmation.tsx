import { useNavigate } from 'react-router-dom'
import { useFlow1 } from './Flow1Layout'
import { CheckCircle, Download, ArrowRight, Home } from 'lucide-react'
import { useFeedbackStore } from '@/core/store/feedbackStore'

export default function F1Confirmation() {
  const navigate = useNavigate()
  const { data } = useFlow1()
  const setFeedbackOpen = useFeedbackStore((s) => s.setModalOpen)

  const refNum = `IRA-${Date.now().toString().slice(-8)}`
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success hero */}
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
        <p className="text-sm text-emerald-600 dark:text-emerald-500">
          Your IRA contribution has been successfully processed and recorded.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Transaction Summary</h3>
        </div>
        <div className="divide-y divide-[var(--border-default)]">
          {[
            { label: 'Reference Number', value: refNum, mono: true },
            { label: 'Contribution Amount', value: `$${(data.contributionAmount || 500).toLocaleString()}.00`, bold: true },
            { label: 'Account Type', value: data.accountType || 'Traditional IRA' },
            { label: 'Frequency', value: data.contributionFrequency ? data.contributionFrequency.charAt(0).toUpperCase() + data.contributionFrequency.slice(1) : 'One-Time' },
            { label: 'Bank Account', value: data.bankAccount?.accountName || 'Chase Bank ···1234' },
            { label: 'Processed Date', value: today },
            { label: 'Expected Settlement', value: '1-3 Business Days' },
            { label: 'Remaining 2025 Limit', value: `$${(1500 - (data.contributionAmount || 500)).toLocaleString()}.00`, color: 'text-emerald-500' },
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

      {/* Progress bar post-contribution */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">2025 Contribution Progress</h3>
          <span className="text-xs text-[var(--text-muted)]">$7,000 limit</span>
        </div>
        <div className="h-3 bg-[var(--border-default)] rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.min(((5500 + (data.contributionAmount || 0)) / 7000) * 100, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>${(5500 + (data.contributionAmount || 0)).toLocaleString()} contributed</span>
          <span>${Math.max(0, 1500 - (data.contributionAmount || 0)).toLocaleString()} remaining</span>
        </div>
      </div>

      {/* Feedback prompt */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">How was your experience?</p>
          <p className="text-xs text-[var(--text-secondary)]">Help us improve the IRA contribution flow.</p>
        </div>
        <button onClick={() => setFeedbackOpen(true)} className="btn-brand px-4 py-2 rounded-lg text-xs font-semibold shrink-0">
          Share Feedback
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => { window.print() }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
        >
          <Download className="h-4 w-4" />
          Download Receipt
        </button>
        <button
          onClick={() => navigate('/ira-payment')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          Make Another Payment
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 btn-brand flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
