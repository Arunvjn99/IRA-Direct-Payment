import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNewPayment } from '../NewPaymentLayout'
import { CheckCircle, Download, ArrowRight } from 'lucide-react'

export default function Step4Success() {
  const navigate = useNavigate()
  const { data } = useNewPayment()

  return (
    <div className="space-y-5">
      {/* Success card */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/20 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <CheckCircle className="h-9 w-9 text-emerald-500" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Payment Successful!</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Your {data.taxYear} IRA contribution of <strong>${(data.amount || 0).toLocaleString()}.00</strong> has been processed.
        </p>
      </div>

      {/* Transaction details */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Transaction Details</h3>
        </div>
        <div className="p-6 space-y-3">
          {[
            { label: 'Transaction ID', value: data.transactionId || '—', mono: true },
            { label: 'Tax Year', value: `${data.taxYear} Traditional IRA` },
            { label: 'Amount', value: `$${(data.amount || 0).toLocaleString()}.00`, bold: true },
            { label: 'Payment Method', value: 'Authorize.net' },
            { label: 'Card Type', value: data.cardType || '—' },
            { label: 'Status', value: 'Success', green: true },
            { label: 'Date', value: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center py-1 border-b border-[var(--border-default)] last:border-0">
              <span className="text-xs text-[var(--text-muted)]">{row.label}</span>
              <span className={`text-sm font-semibold ${
                row.green ? 'text-emerald-500' : row.mono ? 'font-mono text-xs text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'
              }`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* IRS confirmation notice */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 px-4 py-3">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>IRS Reporting:</strong> This contribution will be reported on Form 5498. Keep this confirmation for your tax records. You will receive a confirmation email shortly.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          <Download className="h-4 w-4" />
          Download Receipt
        </button>
        <button
          onClick={() => navigate('/payments')}
          className="flex items-center justify-center gap-2 btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold flex-1"
        >
          View Payment History
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
