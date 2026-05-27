import { useNavigate } from 'react-router-dom'
import { useFlow1 } from './Flow1Layout'
import { useState } from 'react'

const FREQUENCIES = [
  { id: 'monthly', label: 'Monthly', sub: 'Automatic monthly deduction' },
  { id: 'quarterly', label: 'Quarterly', sub: 'Every 3 months' },
  { id: 'annual', label: 'Annual', sub: 'Once per year' },
  { id: 'one-time', label: 'One-Time', sub: 'Single contribution' },
]

const SOURCES = [
  { id: 'payroll', label: 'Payroll Deduction', sub: 'Deducted from your paycheck' },
  { id: 'bank', label: 'Bank Transfer', sub: 'Direct from your bank account' },
]

export default function F1Settings() {
  const navigate = useNavigate()
  const { data, update } = useFlow1()
  const [source, setSource] = useState(data.paymentMethod || '')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Contribution Frequency</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">How often would you like to contribute?</p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {FREQUENCIES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => update({ contributionFrequency: f.id })}
              className={`text-left rounded-xl border-2 p-4 transition-all ${
                data.contributionFrequency === f.id
                  ? 'border-[color:var(--color-primary)] bg-[var(--color-primary-light)]'
                  : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
              }`}
            >
              <p className="text-sm font-semibold text-[var(--text-primary)]">{f.label}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{f.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Contribution Source</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Where will the funds come from?</p>
        </div>
        <div className="p-4 space-y-3">
          {SOURCES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setSource(s.id); update({ paymentMethod: s.id }) }}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all flex items-center justify-between ${
                source === s.id
                  ? 'border-[color:var(--color-primary)] bg-[var(--color-primary-light)]'
                  : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{s.label}</p>
                <p className="text-xs text-[var(--text-secondary)]">{s.sub}</p>
              </div>
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${source === s.id ? 'border-[color:var(--color-primary)]' : 'border-[var(--border-strong)]'}`}>
                {source === s.id && <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-primary)' }} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Account Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[var(--surface-elevated)] p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Account Type</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{data.accountType || 'Traditional IRA'}</p>
          </div>
          <div className="rounded-xl bg-[var(--surface-elevated)] p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Plan ID</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">IRA-124542</p>
          </div>
          <div className="rounded-xl bg-[var(--surface-elevated)] p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Current Balance</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">$34,506.00</p>
          </div>
          <div className="rounded-xl bg-[var(--surface-elevated)] p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Remaining Limit</p>
            <p className="text-sm font-semibold text-emerald-500">$1,500.00</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <button onClick={() => navigate('/ira-payment/flow1')} className="px-5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          ← Back
        </button>
        <button
          disabled={!data.contributionFrequency || !data.paymentMethod}
          onClick={() => navigate('/ira-payment/flow1/contribution')}
          className="btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
