import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertsApi } from '@/lib/api'
import type { AlertFilters } from '@/types'
import { useUIStore } from '@/store/uiStore'

export function useAlerts(filters?: AlertFilters) {
  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: () => alertsApi.getAlerts(filters),
  })
}

export function useAlert(id: string | undefined) {
  return useQuery({
    queryKey: ['alert', id],
    queryFn: () => alertsApi.getAlert(id!),
    enabled: !!id,
  })
}

export function useAlertStats() {
  return useQuery({
    queryKey: ['alert-stats'],
    queryFn: () => alertsApi.getAlertStats(),
    refetchInterval: 60_000,
  })
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)

  return useMutation({
    mutationFn: (id: string) => alertsApi.acknowledgeAlert(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['alert', data.id] })
      queryClient.invalidateQueries({ queryKey: ['alert-stats'] })
      addNotification('Alert acknowledged successfully', 'success')
    },
    onError: () => {
      addNotification('Failed to acknowledge alert', 'error')
    },
  })
}

export function useUpdateAlert() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof alertsApi.updateAlert>[1] }) =>
      alertsApi.updateAlert(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['alert', data.id] })
      queryClient.invalidateQueries({ queryKey: ['alert-stats'] })
      addNotification('Alert updated successfully', 'success')
    },
    onError: () => {
      addNotification('Failed to update alert', 'error')
    },
  })
}

export function useBulkAcknowledgeAlerts() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)

  return useMutation({
    mutationFn: (ids: string[]) => alertsApi.bulkAcknowledge(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['alert-stats'] })
      addNotification('Alerts acknowledged successfully', 'success')
    },
    onError: () => {
      addNotification('Failed to acknowledge alerts', 'error')
    },
  })
}
