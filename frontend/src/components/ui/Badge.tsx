import { cn, severityBg } from '@/lib/utils'
import type { AlertSeverity } from '@/types'

interface SeverityBadgeProps {
  severity: AlertSeverity | string
  className?: string
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border uppercase tracking-wide',
        severityBg(severity),
        className,
      )}
    >
      {severity}
    </span>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantClass = {
    default: 'bg-surface-elevated text-text-secondary border-border',
    success: 'bg-green-900/40 text-green-300 border-green-700/50',
    warning: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
    danger: 'bg-red-900/40 text-red-300 border-red-700/50',
    info: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    accent: 'bg-accent/20 text-accent border-accent/30',
  }[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border',
        variantClass,
        className,
      )}
    >
      {children}
    </span>
  )
}
