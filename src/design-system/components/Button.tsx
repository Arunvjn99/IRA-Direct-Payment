import { cn } from '@/lib/cn'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]'

  const variants = {
    primary: 'btn-brand',
    secondary: 'border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]',
    ghost: 'text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]',
    danger: 'bg-[var(--status-danger)] text-white hover:opacity-90',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs min-h-[2rem]',
    md: 'px-4 py-2.5 text-sm min-h-[2.5rem]',
    lg: 'px-6 py-3 text-base min-h-[3rem]',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
