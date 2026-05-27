import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFlow1 } from './Flow1Layout'

const STEPS = [
  'Verifying bank account details…',
  'Validating contribution eligibility…',
  'Processing IRA contribution…',
  'Recording transaction…',
  'Sending confirmation…',
]

export default function F1Processing() {
  const navigate = useNavigate()
  const { data } = useFlow1()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((p) => {
        if (p >= STEPS.length - 1) {
          clearInterval(interval)
          setTimeout(() => { setDone(true); navigate('/ira-payment/flow1/confirmation') }, 800)
          return p
        }
        return p + 1
      })
    }, 900)
    return () => clearInterval(interval)
  }, [navigate])

  return (
    <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="relative mb-8">
        <div className="h-24 w-24 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-light)' }}>
          <div className="h-12 w-12 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
        </div>
        <div className="absolute -inset-4 rounded-full border-2 animate-ping opacity-20" style={{ borderColor: 'var(--color-primary)' }} />
      </div>

      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Processing Your Contribution</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        Contributing <strong className="text-[var(--text-primary)]">${(data.contributionAmount || 500).toLocaleString()}</strong> to your {data.accountType || 'Traditional IRA'}
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
            <p className={`text-sm ${i <= step ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{s}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
