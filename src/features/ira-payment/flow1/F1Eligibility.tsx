import { useNavigate } from 'react-router-dom'
import { useFlow1 } from './Flow1Layout'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

const CHECKS = [
  { label: 'You have earned income in 2025', pass: true },
  { label: 'You are under age 70½ (Traditional IRA)', pass: true },
  { label: '2025 contribution limit available', pass: true, sub: '$1,500 remaining of $7,000' },
  { label: 'Tax filing status verified', pass: true },
  { label: 'No excess contributions detected', pass: true },
]

const IRA_PLANS = [
  { id: 'trad', label: 'Traditional IRA', sub: 'Pre-tax contributions, tax-deferred growth', badge: 'Most Popular' },
  { id: 'roth', label: 'Roth IRA', sub: 'After-tax contributions, tax-free growth', badge: '' },
]

export default function F1Eligibility() {
  const navigate = useNavigate()
  const { data, update } = useFlow1()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Eligibility checks */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)] flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Eligibility Check</h3>
            <p className="text-xs text-[var(--text-muted)]">Confirming your IRA contribution eligibility</p>
          </div>
        </div>
        <div className="divide-y divide-[var(--border-default)]">
          {CHECKS.map((c) => (
            <div key={c.label} className="flex items-center gap-3 px-6 py-3.5">
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">{c.label}</p>
                {c.sub && <p className="text-xs text-[var(--text-muted)]">{c.sub}</p>}
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">Passed</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-emerald-50 dark:bg-emerald-950/20 border-t border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">All eligibility checks passed! You're eligible to contribute.</p>
          </div>
        </div>
      </div>

      {/* Plan selection */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Select IRA Account Type</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Choose which IRA you'd like to contribute to</p>
        </div>
        <div className="p-4 space-y-3">
          {IRA_PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => update({ planId: plan.id, accountType: plan.label })}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                data.planId === plan.id
                  ? 'border-[color:var(--color-primary)] bg-[var(--color-primary-light)]'
                  : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{plan.label}</p>
                    {plan.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">{plan.badge}</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{plan.sub}</p>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  data.planId === plan.id ? 'border-[color:var(--color-primary)]' : 'border-[var(--border-strong)]'
                }`}>
                  {data.planId === plan.id && <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-primary)' }} />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 px-4 py-3 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>2025 IRA Limit:</strong> $7,000 per year ($8,000 if age 50 or older). Contributions must be made by the tax filing deadline.
        </p>
      </div>

      {/* Action */}
      <div className="flex justify-end gap-3">
        <button onClick={() => navigate('/ira-payment')} className="px-5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          Cancel
        </button>
        <button
          disabled={!data.planId}
          onClick={() => navigate('/ira-payment/flow1/settings')}
          className="btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
