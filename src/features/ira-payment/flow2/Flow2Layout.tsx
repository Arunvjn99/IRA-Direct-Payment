import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, createContext, useContext, useMemo } from 'react'
import { ArrowLeft, Check } from 'lucide-react'

export interface Flow2Data {
  amount?: number
  contributionYear?: string
  bankAccountId?: string
  bankName?: string
  accountLast4?: string
  confirmed?: boolean
}

interface Flow2Context {
  data: Flow2Data
  update: (d: Partial<Flow2Data>) => void
}

const Ctx = createContext<Flow2Context | undefined>(undefined)

export function useFlow2() {
  const ctx = useContext(Ctx)
  if (!ctx) return { data: {} as Flow2Data, update: (_d: Partial<Flow2Data>) => {} }
  return ctx
}

const STEPS = [
  { number: 1, label: 'Amount', path: '/ira-payment/flow2' },
  { number: 2, label: 'Bank Account', path: '/ira-payment/flow2/bank' },
  { number: 3, label: 'Processing', path: '/ira-payment/flow2/processing' },
  { number: 4, label: 'Confirmation', path: '/ira-payment/flow2/confirmation' },
]

export default function Flow2Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState<Flow2Data>({})

  const update = (d: Partial<Flow2Data>) => setData((p) => ({ ...p, ...d }))

  const currentIdx = useMemo(() => {
    const idx = STEPS.findIndex((s) => s.path === location.pathname)
    return idx >= 0 ? idx : 0
  }, [location.pathname])

  const currentStep = currentIdx + 1

  return (
    <Ctx.Provider value={{ data, update }}>
      <div className="min-h-0 flex-1 flex flex-col">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <span className="text-xs text-[var(--text-muted)]">Quick IRA Contribution · Flow 2</span>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between relative z-10">
              {STEPS.map((step, i) => {
                const done = i < currentIdx
                const active = i === currentIdx
                return (
                  <div key={step.number} className="flex flex-col items-center gap-1.5 flex-1">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done ? 'bg-emerald-500 text-white' :
                      active ? 'text-white shadow-[var(--shadow-btn)]' :
                      'bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-[var(--border-default)]'
                    }`} style={active ? { background: 'var(--color-primary)' } : {}}>
                      {done ? <Check className="h-4 w-4" /> : step.number}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${active ? 'text-[var(--text-primary)]' : done ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="absolute top-4 left-4 right-4 h-px bg-[var(--border-default)] -translate-y-1/2 z-0" />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">{STEPS[currentIdx]?.label}</h2>
            <span className="text-xs text-[var(--text-muted)]">Step {currentStep} of {STEPS.length}</span>
          </div>
        </div>

        <Outlet />
      </div>
    </Ctx.Provider>
  )
}
