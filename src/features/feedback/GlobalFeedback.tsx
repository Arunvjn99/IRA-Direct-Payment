import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MessageSquarePlus, Star, X } from 'lucide-react'
import { useFeedbackStore } from '@/core/store/feedbackStore'
import { useAuthStore } from '@/core/store/authStore'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/cn'

const TOAST_MS = 4200

export function GlobalFeedback() {
  const modalOpen = useFeedbackStore((s) => s.modalOpen)
  const setModalOpen = useFeedbackStore((s) => s.setModalOpen)
  const toastMessage = useFeedbackStore((s) => s.toastMessage)
  const showToast = useFeedbackStore((s) => s.showToast)
  const clearToast = useFeedbackStore((s) => s.clearToast)
  const user = useAuthStore((s) => s.user)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const resetForm = useCallback(() => { setRating(0); setComment(''); setError(null) }, [])
  const closeModal = useCallback(() => { setModalOpen(false); resetForm() }, [setModalOpen, resetForm])

  useEffect(() => {
    if (!modalOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [modalOpen])

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, closeModal])

  useEffect(() => {
    if (!toastMessage) return
    const t = window.setTimeout(() => clearToast(), TOAST_MS)
    return () => window.clearTimeout(t)
  }, [toastMessage, clearToast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1) { setError('Please select a rating'); return }
    setError(null)
    setSubmitting(true)

    if (supabase) {
      try {
        await supabase.from('feedback').insert({
          user_id: user?.id ?? null,
          page_path: window.location.pathname,
          rating,
          comment: comment.trim() || null,
          flow_type: 'ira-direct-payment',
        })
        showToast('Thank you for your feedback!')
      } catch {
        showToast('Feedback noted (demo mode)')
      }
    } else {
      showToast('Feedback noted (demo mode) — connect Supabase to persist')
    }

    setSubmitting(false)
    closeModal()
  }

  const modal = modalOpen && createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--surface-overlay)] backdrop-blur-[2px]"
        aria-label="Close"
        onClick={closeModal}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Share feedback"
        className="relative z-[201] w-full max-w-md rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-modal)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Share Feedback</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Help us improve the IRA Direct Payment experience.</p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-elevated)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--text-primary)]">How would you rate this experience?</p>
            <div className="flex gap-1" role="group" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={cn(
                    'rounded-lg p-1.5 transition-colors',
                    n <= rating ? 'text-amber-400' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  )}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  aria-pressed={n <= rating}
                >
                  <Star className={cn('h-8 w-8', n <= rating ? 'fill-amber-400 text-amber-400' : '')} strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="feedback-comment" className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              Comments <span className="font-normal text-[var(--text-muted)]">(optional)</span>
            </label>
            <textarea
              id="feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Tell us what you think..."
              className="w-full resize-y rounded-xl border border-[var(--border-default)] bg-[var(--surface-page)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-[var(--status-danger-bg)] px-3 py-2 text-sm text-[var(--status-danger)]" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={closeModal} className="btn-brand" style={{ background: 'var(--surface-elevated)', color: 'var(--text-primary)', boxShadow: 'none' }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-brand">
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
              ) : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )

  const toast = toastMessage && createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[220] max-w-sm -translate-x-1/2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] px-4 py-3 text-center text-sm font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)]"
    >
      {toastMessage}
    </div>,
    document.body
  )

  return (
    <>
      <button
        type="button"
        onClick={() => { resetForm(); setModalOpen(true) }}
        className={cn(
          'fixed bottom-24 right-6 z-[60] flex h-12 items-center gap-2 rounded-full px-4',
          'border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-primary)] shadow-[var(--shadow-card)]',
          'transition-transform hover:scale-105 hover:shadow-[var(--shadow-dropdown)]'
        )}
        aria-label="Leave feedback"
      >
        <MessageSquarePlus className="h-5 w-5 shrink-0" aria-hidden />
        <span className="whitespace-nowrap text-sm font-medium">Feedback</span>
      </button>
      {modal}
      {toast}
    </>
  )
}

export default GlobalFeedback
