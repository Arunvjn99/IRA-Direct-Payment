import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNewPayment } from '../NewPaymentLayout'
import { usePaymentsStore } from '@/core/store/paymentsStore'
import { AlertTriangle, Info, ChevronDown } from 'lucide-react'

// IRS contribution limits by tax year
const IRS_LIMITS: Record<string, { limit: number; catchupAge: number; catchupLimit: number }> = {
  '2023': { limit: 6500, catchupAge: 50, catchupLimit: 7500 },
  '2024': { limit: 7000, catchupAge: 50, catchupLimit: 8000 },
  '2025': { limit: 7000, catchupAge: 50, catchupLimit: 8000 },
}

const TAX_YEARS = ['2025', '2024', '2023']

const PRESETS = [500, 1000, 1500, 2000, 3500, 7000]

export default function Step1Details() {
  const navigate = useNavigate()
  const { data, update } = useNewPayment()
  const payments = usePaymentsStore((s) => s.payments)

  const [taxYear, setTaxYear] = useState(data.taxYear || '2025')
  const [amount, setAmount] = useState(data.amount?.toString() || '')
  const [errors, setErrors] = useState<{ amount?: string }>({})

  // Calculate how much already contributed for selected year
  const alreadyContributed = payments
    .filter((p) => p.taxYear === taxYear && p.status === 'Success')
    .reduce((sum, p) => sum + p.amount, 0)

  const irsInfo = IRS_LIMITS[taxYear]
  const maxAllowed = irsInfo.limit - alreadyContributed
  const numAmount = parseFloat(amount) || 0

  // Validation state
  const exceedsLimit = numAmount > maxAllowed && numAmount > 0
  const exceedsIrsAnnual = numAmount > irsInfo.limit && numAmount > 0

  const validate = () => {
    const e: { amount?: string } = {}
    if (!numAmount || numAmount <= 0) {
      e.amount = 'Please enter a contribution amount.'
    } else if (exceedsIrsAnnual) {
      e.amount = `The amount entered ($${numAmount.toLocaleString()}) exceeds the IRS annual contribution limit of $${irsInfo.limit.toLocaleString()} for ${taxYear}.`
    } else if (exceedsLimit) {
      e.amount = `You have already contributed $${alreadyContributed.toLocaleString()} for ${taxYear}. The maximum additional contribution is $${maxAllowed.toLocaleString()}.`
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (!validate()) return
    update({ taxYear, amount: numAmount })
    navigate('/payments/new/method')
  }

  return (
    <div className="space-y-5">
      {/* Tax Year Selection */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Select Tax Year</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Choose the tax year for this IRA contribution</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3">
            {TAX_YEARS.map((yr) => {
              const info = IRS_LIMITS[yr]
              const contributed = payments.filter(p => p.taxYear === yr && p.status === 'Success').reduce((s, p) => s + p.amount, 0)
              const remaining = Math.max(0, info.limit - contributed)
              const isFull = remaining === 0
              return (
                <button
                  key={yr}
                  type="button"
                  disabled={isFull}
                  onClick={() => { setTaxYear(yr); setErrors({}); setAmount('') }}
                  className={`relative text-left rounded-xl border-2 p-4 transition-all ${
                    isFull ? 'opacity-50 cursor-not-allowed border-[var(--border-default)]' :
                    taxYear === yr
                      ? 'border-[color:var(--color-primary)] bg-[var(--color-primary-light)]'
                      : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <p className="text-base font-bold text-[var(--text-primary)]">{yr}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Limit: ${info.limit.toLocaleString()}</p>
                  <p className={`text-xs font-semibold mt-1 ${isFull ? 'text-red-500' : 'text-emerald-500'}`}>
                    {isFull ? 'Limit reached' : `$${remaining.toLocaleString()} remaining`}
                  </p>
                  {taxYear === yr && !isFull && (
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* IRS info banner */}
          <div className="mt-4 rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 px-4 py-3 flex gap-2.5">
            <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <strong>IRS {taxYear} Contribution Limit:</strong> ${IRS_LIMITS[taxYear].limit.toLocaleString()} per year
              {' '}(${IRS_LIMITS[taxYear].catchupLimit.toLocaleString()} if age {IRS_LIMITS[taxYear].catchupAge}+).
              Deadline: Tax filing deadline for {taxYear}.
            </div>
          </div>
        </div>
      </div>

      {/* Amount Entry */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Contribution Amount</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Enter the amount you'd like to contribute for {taxYear}</p>
        </div>
        <div className="p-5 space-y-4">
          {/* Quick amounts */}
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Quick Select</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => {
                const contributed = payments.filter(pay => pay.taxYear === taxYear && pay.status === 'Success').reduce((s, pay) => s + pay.amount, 0)
                const remaining = Math.max(0, IRS_LIMITS[taxYear].limit - contributed)
                const isOver = p > remaining
                return (
                  <button
                    key={p}
                    type="button"
                    disabled={isOver}
                    onClick={() => { setAmount(p.toString()); setErrors({}) }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                      isOver ? 'opacity-30 cursor-not-allowed border-[var(--border-default)] text-[var(--text-muted)]' :
                      amount === p.toString()
                        ? 'text-white'
                        : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                    }`}
                    style={amount === p.toString() && !isOver ? { background: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}
                  >
                    ${p.toLocaleString()}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Amount input */}
          <div>
            <div className={`relative rounded-xl border-2 transition-all ${
              errors.amount ? 'border-red-400 dark:border-red-600' :
              exceedsLimit ? 'border-amber-400 dark:border-amber-600' :
              'border-[var(--input-border)] focus-within:border-[var(--border-focus)]'
            }`}>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[var(--text-muted)]">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setErrors({}) }}
                placeholder="0.00"
                min="1"
                step="1"
                className="w-full pl-9 pr-4 py-4 bg-transparent text-[var(--text-primary)] text-2xl font-bold focus:outline-none rounded-xl"
              />
            </div>

            {/* IRS limit exceeded warning — BA requirement */}
            {(errors.amount || exceedsLimit) && (
              <div className={`mt-3 rounded-xl px-4 py-3 flex gap-2.5 border ${
                errors.amount
                  ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40'
                  : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
              }`}>
                <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${errors.amount ? 'text-red-500' : 'text-amber-500'}`} />
                <div>
                  {errors.amount ? (
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">Contribution Limit Exceeded</p>
                  ) : (
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Approaching Contribution Limit</p>
                  )}
                  <p className={`text-xs mt-0.5 ${errors.amount ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {errors.amount || `You have $${maxAllowed.toLocaleString()} remaining for ${taxYear}. Please adjust your amount.`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contribution summary */}
          {numAmount > 0 && !errors.amount && (
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-3">Contribution Summary</p>
              <div className="space-y-2">
                {[
                  { label: `${taxYear} IRS Limit`, value: `$${IRS_LIMITS[taxYear].limit.toLocaleString()}` },
                  { label: 'Already Contributed', value: `-$${alreadyContributed.toLocaleString()}`, neg: true },
                  { label: 'This Contribution', value: `$${numAmount.toLocaleString()}`, bold: true },
                  { label: 'Remaining After Payment', value: `$${Math.max(0, maxAllowed - numAmount).toLocaleString()}`, green: true },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-xs text-[var(--text-secondary)]">{row.label}</span>
                    <span className={`text-sm font-semibold ${row.green ? 'text-emerald-500' : row.neg ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 h-1.5 bg-[var(--border-default)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(((alreadyContributed + numAmount) / IRS_LIMITS[taxYear].limit) * 100, 100)}%`,
                    background: (alreadyContributed + numAmount) > IRS_LIMITS[taxYear].limit ? '#ef4444' : 'var(--color-primary)',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate('/payments')} className="px-5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          Cancel
        </button>
        <button
          onClick={handleContinue}
          disabled={!taxYear || !amount}
          className="btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none"
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  )
}
