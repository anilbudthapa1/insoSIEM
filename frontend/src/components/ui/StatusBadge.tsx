import { cn, statusBg } from '@/lib/utils'
import type { AlertStatus, IncidentStatus } from '@/types'

interface StatusBadgeProps {
  status: AlertStatus | IncidentStatus | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = status.replace(/_/g, ' ')

  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border capitalize',
        statusBg(status),
        className,
      )}
    >
      {label}
    </span>
  )
}
