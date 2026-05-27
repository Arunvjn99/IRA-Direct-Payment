import { useNavigate } from 'react-router-dom'
import { useNewPayment } from '../NewPaymentLayout'
import { Shield, Lock, CheckCircle } from 'lucide-react'

// Authorize.net SVG logo inline
function AuthorizeNetLogo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="24" rx="4" fill="#005B99" />
      <text x="6" y="17" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="white">Authorize.Net</text>
    </svg>
  )
}

export default function Step2Method() {
  const navigate = useNavigate()
  const { data } = useNewPayment()

  return (
    <div className="space-y-5">
      {/* Payment amount reminder */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-elevated)] px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--text-muted)]">Contributing to {data.taxYear} IRA</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-0.5">${(data.amount || 0).toLocaleString()}.00</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-muted)]">Tax Year</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{data.taxYear} Traditional IRA</p>
        </div>
      </div>

      {/* Payment method selection */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Select Payment Option</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Choose your payment gateway to process the contribution</p>
        </div>
        <div className="p-5">
          {/* Authorize.net — the only / selected option per BA spec */}
          <div className="rounded-xl border-2 border-[color:var(--color-primary)] bg-[var(--color-primary-light)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-[#005B99] flex items-center justify-center shadow-lg shrink-0">
                  <span className="text-white font-black text-xs leading-tight text-center px-1">Auth<br/>Net</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-base font-bold text-[var(--text-primary)]">Authorize.net</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">Recommended</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">Secure payment processing by Authorize.net (a Visa solution)</p>
                  <div className="flex flex-wrap gap-2">
                    {['Visa', 'Mastercard', 'AmEx', 'Discover'].map((card) => (
                      <span key={card} className="px-2 py-0.5 rounded bg-white dark:bg-gray-800 border border-[var(--border-default)] text-xs font-medium text-[var(--text-secondary)]">
                        {card}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-6 w-6 rounded-full border-2 border-[color:var(--color-primary)] flex items-center justify-center shrink-0 mt-1">
                <div className="h-3 w-3 rounded-full" style={{ background: 'var(--color-primary)' }} />
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-4 pt-4 border-t border-[var(--border-blue)] grid grid-cols-3 gap-3">
              {[
                { icon: Lock, label: '256-bit SSL', sub: 'Encryption' },
                { icon: Shield, label: 'PCI DSS', sub: 'Compliant' },
                { icon: CheckCircle, label: 'Visa', sub: 'Certified' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="h-4 w-4 text-emerald-500" />
                  <p className="text-xs font-semibold text-[var(--text-primary)]">{label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Other methods — greyed out for future */}
          <div className="mt-3 rounded-xl border border-dashed border-[var(--border-default)] p-4 text-center">
            <p className="text-xs text-[var(--text-muted)]">Additional payment methods (ACH, Wire Transfer) will be available in a future release.</p>
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] px-4 py-3 flex items-start gap-2.5">
        <Lock className="h-4 w-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-secondary)]">
          You will be redirected to the Authorize.net secure payment page to enter your card details.
          Your payment information is processed by Authorize.net and never stored in CORE systems.
        </p>
      </div>

      <div className="flex justify-between gap-3">
        <button onClick={() => navigate('/payments/new')} className="px-5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          ← Back
        </button>
        <button
          onClick={() => navigate('/payments/new/gateway')}
          className="btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold"
        >
          Proceed to Authorize.net →
        </button>
      </div>
    </div>
  )
}
