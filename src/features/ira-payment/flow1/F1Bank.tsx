import { useNavigate } from 'react-router-dom'
import { useFlow1 } from './Flow1Layout'
import { useState } from 'react'
import { Shield, Lock } from 'lucide-react'

export default function F1Bank() {
  const navigate = useNavigate()
  const { data, update } = useFlow1()
  const [form, setForm] = useState({
    routingNumber: data.bankAccount?.routingNumber || '',
    accountNumber: data.bankAccount?.accountNumber || '',
    accountName: data.bankAccount?.accountName || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [useExisting, setUseExisting] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.accountName) e.accountName = 'Account holder name required'
    if (!form.routingNumber || form.routingNumber.length !== 9) e.routingNumber = 'Routing number must be 9 digits'
    if (!form.accountNumber || form.accountNumber.length < 8) e.accountNumber = 'Account number must be at least 8 digits'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (useExisting) {
      update({ bankAccount: { routingNumber: '021000021', accountNumber: '****1234', accountName: 'Chase Bank ···1234' } })
      navigate('/ira-payment/flow1/processing')
      return
    }
    if (!validate()) return
    update({ bankAccount: form })
    navigate('/ira-payment/flow1/processing')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Saved accounts */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Saved Bank Accounts</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Select an existing account or add a new one</p>
        </div>
        <div className="p-4">
          <button
            type="button"
            onClick={() => setUseExisting((p) => !p)}
            className={`w-full text-left rounded-xl border-2 p-4 transition-all flex items-center gap-3 ${
              useExisting
                ? 'border-[color:var(--color-primary)] bg-[var(--color-primary-light)]'
                : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 text-sm">
              C
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Chase Bank ···1234</p>
              <p className="text-xs text-[var(--text-secondary)]">Checking · Routing: 021000021</p>
            </div>
            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${useExisting ? 'border-[color:var(--color-primary)]' : 'border-[var(--border-strong)]'}`}>
              {useExisting && <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-primary)' }} />}
            </div>
          </button>
        </div>
      </div>

      {/* Add new */}
      {!useExisting && (
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-default)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Add New Bank Account</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Account Holder Name</label>
              <input
                type="text"
                value={form.accountName}
                onChange={(e) => setForm((p) => ({ ...p, accountName: e.target.value }))}
                placeholder="Full legal name on account"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all"
              />
              {errors.accountName && <p className="text-xs text-[var(--status-danger)] mt-1">{errors.accountName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Routing Number</label>
              <input
                type="text"
                value={form.routingNumber}
                onChange={(e) => setForm((p) => ({ ...p, routingNumber: e.target.value.replace(/\D/g, '').slice(0, 9) }))}
                placeholder="9-digit routing number"
                maxLength={9}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all font-mono"
              />
              {errors.routingNumber && <p className="text-xs text-[var(--status-danger)] mt-1">{errors.routingNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Account Number</label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) => setForm((p) => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 17) }))}
                placeholder="Bank account number"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all font-mono"
              />
              {errors.accountNumber && <p className="text-xs text-[var(--status-danger)] mt-1">{errors.accountNumber}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Security note */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 flex items-start gap-2.5">
        <Lock className="h-4 w-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Shield className="h-3.5 w-3.5 text-emerald-500" />
            <p className="text-xs font-semibold text-[var(--text-primary)]">Bank-grade encryption</p>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">Your banking information is encrypted with 256-bit SSL and is never stored in plain text.</p>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <button onClick={() => navigate('/ira-payment/flow1/contribution')} className="px-5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          ← Back
        </button>
        <button onClick={handleContinue} className="btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold">
          Submit Contribution →
        </button>
      </div>
    </div>
  )
}
