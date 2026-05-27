import { useNavigate } from 'react-router-dom'
import { useFlow2 } from './Flow2Layout'
import { useState } from 'react'
import { Shield, Lock, Plus } from 'lucide-react'

const SAVED_ACCOUNTS = [
  { id: 'chase', bank: 'Chase Bank', last4: '1234', type: 'Checking', routing: '021000021', letter: 'C', color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' },
  { id: 'boa', bank: 'Bank of America', last4: '5678', type: 'Savings', routing: '026009593', letter: 'B', color: 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400' },
]

export default function F2Bank() {
  const navigate = useNavigate()
  const { data, update } = useFlow2()
  const [selected, setSelected] = useState(data.bankAccountId || '')
  const [addNew, setAddNew] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', routing: '', account: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleContinue = () => {
    if (addNew) {
      const e: Record<string, string> = {}
      if (!newForm.name) e.name = 'Required'
      if (!newForm.routing || newForm.routing.length !== 9) e.routing = '9 digits required'
      if (!newForm.account || newForm.account.length < 8) e.account = 'Minimum 8 digits'
      setErrors(e)
      if (Object.keys(e).length) return
      update({ bankAccountId: 'new', bankName: 'New Bank', accountLast4: newForm.account.slice(-4) })
    } else {
      if (!selected) { setErrors({ select: 'Please select an account' }); return }
      const acc = SAVED_ACCOUNTS.find((a) => a.id === selected)
      update({ bankAccountId: selected, bankName: acc?.bank, accountLast4: acc?.last4 })
    }
    navigate('/ira-payment/flow2/processing')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Review summary */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--text-muted)]">Contribution Amount</p>
          <p className="text-xl font-bold text-[var(--text-primary)]">${(data.amount || 0).toLocaleString()}.00</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-muted)]">Tax Year</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{data.contributionYear || '2025'} IRA</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Select Payment Account</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Funds will be deducted from this account</p>
        </div>
        <div className="p-4 space-y-3">
          {!addNew && SAVED_ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => { setSelected(acc.id); setErrors({}) }}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all flex items-center gap-3 ${
                selected === acc.id
                  ? 'border-[color:var(--color-primary)] bg-[var(--color-primary-light)]'
                  : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm ${acc.color}`}>
                {acc.letter}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{acc.bank} ···{acc.last4}</p>
                <p className="text-xs text-[var(--text-secondary)]">{acc.type} · Routing: {acc.routing}</p>
              </div>
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selected === acc.id ? 'border-[color:var(--color-primary)]' : 'border-[var(--border-strong)]'}`}>
                {selected === acc.id && <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-primary)' }} />}
              </div>
            </button>
          ))}

          {errors.select && <p className="text-xs text-[var(--status-danger)]">{errors.select}</p>}

          {addNew ? (
            <div className="rounded-xl border-2 border-[color:var(--color-primary)] bg-[var(--color-primary-light)] p-4 space-y-3">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">New Bank Account</h4>
              {[
                { key: 'name', label: 'Account Holder Name', placeholder: 'Full legal name', type: 'text' },
                { key: 'routing', label: 'Routing Number', placeholder: '9-digit routing number', type: 'text', maxLen: 9 },
                { key: 'account', label: 'Account Number', placeholder: 'Bank account number', type: 'text' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={newForm[f.key as keyof typeof newForm]}
                    onChange={(e) => setNewForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    maxLength={f.maxLen}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
                  />
                  {errors[f.key] && <p className="text-xs text-[var(--status-danger)] mt-0.5">{errors[f.key]}</p>}
                </div>
              ))}
              <button onClick={() => setAddNew(false)} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">← Use saved account</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { setAddNew(true); setSelected('') }}
              className="w-full flex items-center gap-2 rounded-xl border-2 border-dashed border-[var(--border-default)] p-4 text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-all"
            >
              <Plus className="h-4 w-4" />
              Add New Bank Account
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 flex items-start gap-2.5">
        <Lock className="h-4 w-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
        <div className="flex items-start gap-1.5">
          <Shield className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--text-secondary)]">256-bit SSL encryption. Bank details are never stored in plain text.</p>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <button onClick={() => navigate('/ira-payment/flow2')} className="px-5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          ← Back
        </button>
        <button onClick={handleContinue} className="btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold">
          Review & Confirm →
        </button>
      </div>
    </div>
  )
}
