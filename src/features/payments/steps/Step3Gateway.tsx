import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNewPayment } from '../NewPaymentLayout'
import { usePaymentsStore } from '@/core/store/paymentsStore'
import { Lock, Shield, CreditCard, AlertCircle } from 'lucide-react'

function detectCardType(num: string): string {
  const n = num.replace(/\s/g, '')
  if (/^4/.test(n)) return 'Visa'
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard'
  if (/^3[47]/.test(n)) return 'AmEx'
  if (/^6(?:011|5)/.test(n)) return 'Discover'
  return ''
}

function formatCardNumber(val: string, type: string): string {
  const digits = val.replace(/\D/g, '')
  if (type === 'AmEx') {
    return digits.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').substring(0, 17)
  }
  return digits.replace(/(\d{4})/g, '$1 ').trim().substring(0, 19)
}

function formatExpiry(val: string): string {
  const digits = val.replace(/\D/g, '')
  if (digits.length >= 3) return digits.substring(0, 2) + '/' + digits.substring(2, 4)
  return digits
}

const CARD_ICONS: Record<string, string> = {
  Visa: '💳',
  Mastercard: '💳',
  AmEx: '💳',
  Discover: '💳',
}

export default function Step3Gateway() {
  const navigate = useNavigate()
  const { data, update } = useNewPayment()
  const addPayment = usePaymentsStore((s) => s.addPayment)

  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const cardType = detectCardType(cardNumber)

  const PROCESSING_STEPS = [
    'Connecting to Authorize.net…',
    'Encrypting card data…',
    'Verifying with issuing bank…',
    'Processing payment…',
    'Payment approved!',
  ]

  const validate = () => {
    const e: Record<string, string> = {}
    const raw = cardNumber.replace(/\s/g, '')
    if (raw.length < 13) e.cardNumber = 'Enter a valid card number.'
    const [mm] = expiry.split('/')
    if (!expiry.includes('/') || expiry.length < 5 || parseInt(mm) > 12 || parseInt(mm) < 1) e.expiry = 'Enter a valid expiry (MM/YY).'
    if (cvv.length < 3) e.cvv = 'Enter a valid CVV.'
    if (!cardName.trim()) e.cardName = 'Enter the cardholder name.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setProcessing(true)
    setProcessingStep(0)
  }

  useEffect(() => {
    if (!processing) return
    if (processingStep < PROCESSING_STEPS.length - 1) {
      const t = setTimeout(() => setProcessingStep((s) => s + 1), 800)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        const txId = 'AUTH-' + Math.floor(10000000 + Math.random() * 90000000)
        const raw = cardNumber.replace(/\s/g, '')
        const last4 = raw.slice(-4)
        addPayment({
          id: 'pay-' + Date.now(),
          taxYear: data.taxYear!,
          amount: data.amount!,
          method: 'authorize.net',
          status: 'Success',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          transactionId: txId,
          accountLastFour: last4,
          cardType: cardType || 'Card',
        })
        update({ transactionId: txId, cardType: cardType || 'Card' })
        navigate('/payments/new/success')
      }, 600)
      return () => clearTimeout(t)
    }
  }, [processing, processingStep])

  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="h-20 w-20 rounded-full bg-[#005B99]/10 flex items-center justify-center">
          <div className="h-12 w-12 rounded-lg bg-[#005B99] flex items-center justify-center">
            <span className="text-white font-black text-xs">AN</span>
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-base font-semibold text-[var(--text-primary)]">{PROCESSING_STEPS[processingStep]}</p>
          <p className="text-sm text-[var(--text-muted)]">Please do not close this window</p>
        </div>
        <div className="w-64 space-y-2">
          {PROCESSING_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                i < processingStep ? 'bg-emerald-500' : i === processingStep ? 'bg-[#005B99]' : 'bg-[var(--border-default)]'
              }`}>
                {i < processingStep ? (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : i === processingStep ? (
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                ) : null}
              </div>
              <p className={`text-xs ${i <= processingStep ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{step}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Lock className="h-3.5 w-3.5" />
          Secured by Authorize.net
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Authorize.net header */}
      <div className="rounded-2xl overflow-hidden border border-[var(--border-default)]">
        <div className="bg-[#005B99] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white font-black text-sm">AN</span>
            </div>
            <div>
              <p className="text-white font-bold text-base">Authorize.net</p>
              <p className="text-blue-200 text-xs">Secure Payment Gateway — A Visa Solution</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <Lock className="h-3.5 w-3.5 text-white" />
            <span className="text-white text-xs font-semibold">256-bit SSL</span>
          </div>
        </div>

        {/* Amount banner */}
        <div className="bg-[#004a80] px-6 py-3 flex items-center justify-between">
          <p className="text-blue-200 text-sm">Amount Due</p>
          <p className="text-white text-xl font-bold">${(data.amount || 0).toLocaleString()}.00</p>
        </div>

        {/* Payment form */}
        <div className="bg-[var(--surface-card)] p-6 space-y-5">
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">Enter Card Details</p>

          {/* Card number */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Card Number</label>
            <div className={`relative rounded-xl border-2 transition-all ${errors.cardNumber ? 'border-red-400' : 'border-[var(--input-border)] focus-within:border-[#005B99]'}`}>
              <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                inputMode="numeric"
                value={formatCardNumber(cardNumber, cardType)}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                placeholder={cardType === 'AmEx' ? '3782 822463 10005' : '4111 1111 1111 1111'}
                maxLength={cardType === 'AmEx' ? 17 : 19}
                className="w-full pl-10 pr-16 py-3.5 bg-transparent text-[var(--text-primary)] text-sm font-mono focus:outline-none rounded-xl"
              />
              {cardType && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#005B99] bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded">
                  {cardType}
                </span>
              )}
            </div>
            {errors.cardNumber && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.cardNumber}</p>}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Expiration Date</label>
              <input
                type="text"
                inputMode="numeric"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full px-4 py-3.5 rounded-xl border-2 bg-transparent text-[var(--text-primary)] text-sm font-mono focus:outline-none transition-all ${errors.expiry ? 'border-red-400' : 'border-[var(--input-border)] focus:border-[#005B99]'}`}
              />
              {errors.expiry && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.expiry}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">CVV / Security Code</label>
              <input
                type="password"
                inputMode="numeric"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, cardType === 'AmEx' ? 4 : 3))}
                placeholder={cardType === 'AmEx' ? '4 digits' : '3 digits'}
                maxLength={cardType === 'AmEx' ? 4 : 3}
                className={`w-full px-4 py-3.5 rounded-xl border-2 bg-transparent text-[var(--text-primary)] text-sm font-mono focus:outline-none transition-all ${errors.cvv ? 'border-red-400' : 'border-[var(--input-border)] focus:border-[#005B99]'}`}
              />
              {errors.cvv && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.cvv}</p>}
            </div>
          </div>

          {/* Cardholder name */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Cardholder Name</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Name as it appears on card"
              className={`w-full px-4 py-3.5 rounded-xl border-2 bg-transparent text-[var(--text-primary)] text-sm focus:outline-none transition-all ${errors.cardName ? 'border-red-400' : 'border-[var(--input-border)] focus:border-[#005B99]'}`}
            />
            {errors.cardName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.cardName}</p>}
          </div>

          {/* Accepted cards */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-[var(--text-muted)]">Accepted:</p>
            {['Visa', 'Mastercard', 'AmEx', 'Discover'].map((c) => (
              <span key={c} className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                cardType === c ? 'border-[#005B99] bg-blue-50 dark:bg-blue-950/30 text-[#005B99]' : 'border-[var(--border-default)] text-[var(--text-muted)]'
              }`}>{c}</span>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[var(--border-default)]">
            {[
              { icon: Lock, label: '256-bit SSL', sub: 'Encrypted' },
              { icon: Shield, label: 'PCI DSS', sub: 'Level 1' },
              { icon: Shield, label: 'Authorize.net', sub: 'Certified' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <Icon className="h-4 w-4 text-[#005B99]" />
                <p className="text-xs font-semibold text-[var(--text-primary)]">{label}</p>
                <p className="text-xs text-[var(--text-muted)]">{sub}</p>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#005B99' }}
          >
            Pay ${(data.amount || 0).toLocaleString()}.00 Securely →
          </button>

          <p className="text-center text-xs text-[var(--text-muted)]">
            By clicking Pay, you authorize this charge. Your card info is processed by Authorize.net and never stored in CORE systems.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-[var(--surface-elevated)] px-6 py-3 flex items-center justify-center gap-2 border-t border-[var(--border-default)]">
          <Lock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          <p className="text-xs text-[var(--text-muted)]">Powered by <strong className="text-[#005B99]">Authorize.net</strong> — a Visa solution</p>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <button onClick={() => window.history.back()} className="px-5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
          ← Back
        </button>
        <p className="text-xs text-[var(--text-muted)] self-center">Demo mode — no real charge will be made</p>
      </div>
    </div>
  )
}
