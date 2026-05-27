import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, Wallet, CheckCircle, Clock, Shield } from 'lucide-react'

const FLOWS = [
  {
    id: 'flow1',
    title: 'IRA Contribution Setup',
    subtitle: 'Configure & schedule recurring contributions',
    description: 'Set up your IRA contribution plan, review eligibility, configure payroll deductions or bank transfers, and establish automatic recurring contributions.',
    badge: 'Full Setup',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    cardColor: 'border-blue-200 dark:border-blue-800/40 hover:border-blue-400 dark:hover:border-blue-600',
    iconBg: 'bg-blue-50 dark:bg-blue-950/30',
    icon: Building2,
    iconColor: 'text-blue-600 dark:text-blue-400',
    features: [
      { icon: CheckCircle, text: 'Review contribution eligibility' },
      { icon: Shield, text: 'Configure payroll or bank deductions' },
      { icon: Clock, text: 'Set up automatic recurring contributions' },
      { icon: CheckCircle, text: 'Track contribution status & limits' },
    ],
    path: '/ira-payment/flow1',
    steps: 6,
    time: '~8 min',
  },
  {
    id: 'flow2',
    title: 'Quick IRA Contribution',
    subtitle: 'Make a one-time or simple direct payment',
    description: 'Make a direct IRA contribution from your bank account. Perfect for one-time catch-up contributions or topping up your annual limit quickly.',
    badge: 'Quick Pay',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    cardColor: 'border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-400 dark:hover:border-emerald-600',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    icon: Wallet,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    features: [
      { icon: CheckCircle, text: 'Enter contribution amount' },
      { icon: Shield, text: 'Verify your bank account' },
      { icon: Clock, text: 'Process in 1-3 business days' },
      { icon: CheckCircle, text: 'Instant confirmation & receipt' },
    ],
    path: '/ira-payment/flow2',
    steps: 4,
    time: '~3 min',
  },
]

export default function FlowSelectionPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-4" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
          IRA Direct Payment
        </div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">Choose Your Payment Flow</h1>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
          Select the flow that best matches your needs. You can always return to this page to switch between flows.
        </p>
      </div>

      {/* Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {FLOWS.map((flow) => (
          <button
            key={flow.id}
            onClick={() => navigate(flow.path)}
            className={`group text-left rounded-2xl border-2 bg-[var(--surface-card)] p-6 transition-all duration-200 hover:shadow-[var(--shadow-elevated)] cursor-pointer ${flow.cardColor}`}
          >
            {/* Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${flow.badgeColor}`}>
                {flow.badge}
              </span>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Clock className="h-3.5 w-3.5" />
                {flow.time}
              </div>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${flow.iconBg}`}>
                <flow.icon className={`h-6 w-6 ${flow.iconColor}`} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">{flow.title}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{flow.subtitle}</p>
              </div>
            </div>

            <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">{flow.description}</p>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {flow.features.map((f) => (
                <li key={f.text} className="flex items-center gap-2.5">
                  <f.icon className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-sm text-[var(--text-secondary)]">{f.text}</span>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-default)]">
              <span className="text-xs text-[var(--text-muted)]">{flow.steps} steps</span>
              <div className="flex items-center gap-1.5 text-sm font-semibold transition-transform group-hover:translate-x-1" style={{ color: 'var(--color-primary)' }}>
                Start Flow <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-elevated)] px-6 py-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-[var(--text-muted)] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">Your contributions are secure</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            All IRA contributions are processed through bank-grade encryption. 2025 limit: $7,000 ($8,000 if age 50+). Both flows use the same secure payment infrastructure.
          </p>
        </div>
      </div>
    </div>
  )
}
