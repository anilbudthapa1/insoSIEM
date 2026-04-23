import { useMutation, useQuery } from '@tanstack/react-query'
import { auditApi } from '@/lib/api'
import type { AuditLogFilters } from '@/types'
import { useUIStore } from '@/store/uiStore'

export function useAuditLogs(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => auditApi.getLogs(filters),
  })
}

export function useExportAuditLogs() {
  const addNotification = useUIStore((s) => s.addNotification)

  return useMutation({
    mutationFn: (filters?: AuditLogFilters) => auditApi.exportLogs(filters),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      addNotification('Audit export prepared', 'success')
    },
    onError: () => {
      addNotification('Failed to export audit logs', 'error')
    },
  })
}
