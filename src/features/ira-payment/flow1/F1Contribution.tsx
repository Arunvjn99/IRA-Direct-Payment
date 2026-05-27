import { useNavigate } from 'react-router-dom'
import { useFlow1 } from './Flow1Layout'
import { useState } from 'react'
import { Info, TrendingUp } from 'lucide-react'

const PRESETS = [250, 500, 750, 1000, 1500]

export default function F1Contribution() {
  const navigate = useNavigate()
  const { data, update } = useFlow1()
  const [amount, setAmount] = useState(data.contributionAmount?.toString() || '')
  const [error, setError] = useState('')

  const numAmount = parseFloat(amount) || 0
  const maxAmount = 1500
  const pct = Math.min((numAmount / maxAmount) * 100, 100)

  const validate = () => {
    if (!numAmount || numAmount <= 0) { setError('Please enter a contribution amount'); return false }
    if (numAmount > maxAmount) { setError(`Maximum remaining limit is $${maxAmount.toLocaleString()}`); return false }
    if (numAmount < 1) { setError('Minimum contribution is $1'); return false }
    return true
  }

  const handleContinue = () => {
    if (!validate()) return
    update({ contributionAmount: numAmount })
    navigate('/ira-payment/flow1/bank')
  }

  const freq = data.contributionFrequency || 'monthly'
  const freqLabel = { monthly: '/month', quarterly: '/quarter', annual: '/year', 'one-time': '' }[freq] || ''

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Contribution Status</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">2025 Traditional IRA — Plan ID: IRA-124542</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Annual Limit', value: '$7,000', color: 'text-[var(--text-primary)]' },
              { label: 'Contributed', value: '$5,500', color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Remaining', value: '$1,500', color: 'text-emerald-500' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="h-3 bg-[var(--border-default)] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: '78.5%', background: 'var(--color-primary)' }} />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-2 text-right">78.5% of limit used</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Enter Contribution Amount</h3>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">Quick Select</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { setAmount(p.toString()); setError('') }}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                  amount === p.toString()
                    ? 'border-[color:var(--color-primary)] text-white'
                    : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                }`}
                style={amount === p.toString() ? { background: 'var(--color-primary)' } : {}}
              >
                ${p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg font-semibold">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError('') }}
            placeholder="0.00"
            min="1"
            max="1500"
            step="1"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all"
          />
          {freqLabel && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">{freqLabel}</span>
          )}
        </div>
        {error && <p className="text-xs text-[var(--status-danger)] mb-3">{error}</p>}

        {numAmount > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>This contribution</span>
              <span>{((numAmount / maxAmount) * 100).toFixed(1)}% of remaining</span>
            </div>
            <div className="h-2 bg-[var(--border-default)] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </div>

      {numAmount > 0 && (
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 flex items-start gap-2.5">
          <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Projected Impact</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              A ${numAmount.toLocaleString()} {freqLabel && freq !== 'one-time' ? freq : ''} contribution could grow to approximately{' '}
              <strong className="text-[var(--text-primary)]">${(numAmount * (freq === 'monthly' ? 12 : freq === 'quarterly' ? 4 : 1) * 8).toLocaleString()}</strong>{' '}
              over 10 years (7% avg. return).
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 px-4 py-3 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Your contribution of up to $1,500 will be applied to your 2025 Traditional IRA. Contributions are tax-deductible depending on your income and filing status.
        </p>
      </div>

      <div className="flex justify-between gap-3">
        <button onClick={() => navigate('/ira-payment/flow1/settings')} className="px-5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          ← Back
        </button>
        <button onClick={handleContinue} className="btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold">
          Continue →
        </button>
      </div>
    </div>
  )
}
