import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFlow2 } from './Flow2Layout'

const STEPS = [
  'Verifying account details…',
  'Initiating ACH transfer…',
  'Processing contribution…',
  'Confirming with IRS records…',
]

export default function F2Processing() {
  const navigate = useNavigate()
  const { data } = useFlow2()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((p) => {
        if (p >= STEPS.length - 1) {
          clearInterval(interval)
          setTimeout(() => navigate('/ira-payment/flow2/confirmation'), 700)
          return p
        }
        return p + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [navigate])

  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="relative mb-8">
        <div className="h-24 w-24 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-light)' }}>
          <div className="h-12 w-12 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
        </div>
      </div>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Processing Your Contribution</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        Transferring <strong className="text-[var(--text-primary)]">${(data.amount || 0).toLocaleString()}.00</strong> from {data.bankName || 'your bank'} ···{data.accountLast4 || '1234'}
      </p>

      <div className="w-full space-y-2">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
            i < step ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30' :
            i === step ? 'bg-[var(--color-primary-light)] border border-[var(--border-blue)]' :
            'bg-[var(--surface-elevated)] border border-[var(--border-default)]'
          }`}>
            <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
              i < step ? 'bg-emerald-500 text-white' :
              i === step ? 'bg-[var(--color-primary)] text-white animate-pulse' :
              'bg-[var(--border-default)] text-[var(--text-muted)]'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <p className={`text-sm text-left ${i <= step ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{s}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
