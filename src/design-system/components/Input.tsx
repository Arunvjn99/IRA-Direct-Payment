import { cn } from '@/lib/cn'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border text-sm transition-all',
          'bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent',
          error
            ? 'border-[var(--status-danger)]'
            : 'border-[var(--input-border)] focus:border-[var(--input-border-focus)]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--status-danger)]">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
}
