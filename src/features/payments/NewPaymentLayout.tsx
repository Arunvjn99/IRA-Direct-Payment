import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, createContext, useContext, useMemo } from 'react'
import { ArrowLeft, Check } from 'lucide-react'

export interface NewPaymentData {
  taxYear?: string
  amount?: number
  cardNumber?: string
  cardExpiry?: string
  cardCvv?: string
  cardName?: string
  cardType?: string
  transactionId?: string
}

interface NewPaymentCtx {
  data: NewPaymentData
  update: (d: Partial<NewPaymentData>) => void
}

const Ctx = createContext<NewPaymentCtx | undefined>(undefined)

export function useNewPayment() {
  const ctx = useContext(Ctx)
  if (!ctx) return { data: {} as NewPaymentData, update: (_d: Partial<NewPaymentData>) => {} }
  return ctx
}

const STEPS = [
  { number: 1, label: 'Contribution Details', path: '/payments/new' },
  { number: 2, label: 'Payment Method', path: '/payments/new/method' },
  { number: 3, label: 'Authorize.net Gateway', path: '/payments/new/gateway' },
  { number: 4, label: 'Confirmation', path: '/payments/new/success' },
]

export default function NewPaymentLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState<NewPaymentData>({})

  const update = (d: Partial<NewPaymentData>) => setData((p) => ({ ...p, ...d }))

  const currentIdx = useMemo(() => {
    const idx = STEPS.findIndex((s) => s.path === location.pathname)
    return idx >= 0 ? idx : 0
  }, [location.pathname])

  const currentStep = currentIdx + 1

  return (
    <Ctx.Provider value={{ data, update }}>
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Top nav */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => navigate(currentIdx === 0 ? '/payments' : -1 as never)}
              className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {currentIdx === 0 ? 'Back to Payments' : 'Back'}
            </button>
            <span className="text-xs text-[var(--text-muted)]">|</span>
            <span className="text-xs text-[var(--text-muted)]">New IRA Contribution</span>
          </div>

          {/* Stepper */}
          <div className="relative flex items-start justify-between">
            {/* connector line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-[var(--border-default)] z-0" />
            <div
              className="absolute top-4 left-4 h-0.5 bg-emerald-500 z-0 transition-all duration-500"
              style={{ width: `${(currentIdx / (STEPS.length - 1)) * (100 - (100 / STEPS.length))}%` }}
            />

            {STEPS.map((step, i) => {
              const done = i < currentIdx
              const active = i === currentIdx
              return (
                <div key={step.number} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done ? 'bg-emerald-500 text-white' :
                      active ? 'text-white' :
                      'bg-[var(--surface-elevated)] text-[var(--text-muted)] border-2 border-[var(--border-default)]'
                    }`}
                    style={active ? { background: 'var(--color-primary)' } : {}}
                  >
                    {done ? <Check className="h-4 w-4" /> : step.number}
                  </div>
                  <span className={`text-xs font-medium text-center leading-tight hidden sm:block ${
                    active ? 'text-[var(--text-primary)]' :
                    done ? 'text-emerald-500' :
                    'text-[var(--text-muted)]'
                  }`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{STEPS[currentIdx]?.label}</h1>
            <span className="text-xs text-[var(--text-muted)]">Step {currentStep} of {STEPS.length}</span>
          </div>
        </div>

        <Outlet />
      </div>
    </Ctx.Provider>
  )
}
