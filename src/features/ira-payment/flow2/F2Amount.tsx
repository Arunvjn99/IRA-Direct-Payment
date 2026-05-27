import { useNavigate } from 'react-router-dom'
import { useFlow2 } from './Flow2Layout'
import { useState } from 'react'
import { Info, TrendingUp, DollarSign } from 'lucide-react'

const PRESETS = [100, 250, 500, 1000, 1500]

export default function F2Amount() {
  const navigate = useNavigate()
  const { data, update } = useFlow2()
  const [amount, setAmount] = useState(data.amount?.toString() || '')
  const [year, setYear] = useState(data.contributionYear || '2025')
  const [error, setError] = useState('')

  const numAmount = parseFloat(amount) || 0

  const handleContinue = () => {
    if (!numAmount || numAmount <= 0) { setError('Please enter a contribution amount'); return }
    if (numAmount > 1500) { setError('Maximum remaining limit is $1,500'); return }
    update({ amount: numAmount, contributionYear: year })
    navigate('/ira-payment/flow2/bank')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Account overview card (matching Figma flow2 first screen) */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">ACMI Moderate Steps</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">$34,506.00</p>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-500 font-semibold">+$2,506.06 (7.8%)</span>
            </div>
          </div>
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-primary-light)' }}>
            <DollarSign className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Cost Basis', value: '$32,000.00' },
            { label: 'YTD Return', value: '+$2,506.06', green: true },
            { label: '2025 Remaining', value: '$1,500.00', blue: true },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-[var(--surface-elevated)] p-3 text-center">
              <p className={`text-sm font-bold ${s.green ? 'text-emerald-500' : s.blue ? '' : 'text-[var(--text-primary)]'}`} style={s.blue ? { color: 'var(--color-primary)' } : {}}>
                {s.value}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contribution form */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">New Contribution</h3>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">Contribution Year</label>
          <div className="flex gap-2">
            {['2025', '2024'].map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                  year === y ? 'text-white' : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                }`}
                style={year === y ? { background: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">Quick Amounts</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { setAmount(p.toString()); setError('') }}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                  amount === p.toString() ? 'text-white' : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                }`}
                style={amount === p.toString() ? { background: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}
              >
                ${p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg font-semibold">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError('') }}
            placeholder="0.00"
            min="1"
            max="1500"
            className="w-full pl-9 pr-4 py-4 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all"
          />
        </div>
        {error && <p className="text-xs text-[var(--status-danger)] mb-3">{error}</p>}

        <p className="text-xs text-[var(--text-muted)] mt-2">Remaining {year} limit: <strong className="text-[var(--text-primary)]">$1,500.00</strong></p>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 px-4 py-3 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Contributions are processed via ACH bank transfer and typically settle in 1-3 business days. You can contribute to a prior tax year up until the filing deadline.
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate('/ira-payment')} className="px-5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          Cancel
        </button>
        <button onClick={handleContinue} className="btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold">
          Continue →
        </button>
      </div>
    </div>
  )
}
