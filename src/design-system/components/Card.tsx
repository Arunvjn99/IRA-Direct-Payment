import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered'
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const variants = {
    default: 'bg-[var(--surface-card)] border border-[var(--border-default)] rounded-2xl shadow-[var(--shadow-sm)]',
    elevated: 'bg-[var(--surface-card)] rounded-2xl shadow-[var(--shadow-card)]',
    bordered: 'bg-[var(--surface-card)] border-2 border-[var(--border-default)] rounded-2xl',
  }
  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  )
}
