import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { incidentsApi } from '@/lib/api'
import type { Incident, IncidentFilters, IncidentTimeline } from '@/types'
import { useUIStore } from '@/store/uiStore'

export function useIncidents(filters?: IncidentFilters) {
  return useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => incidentsApi.getIncidents(filters),
  })
}

export function useIncident(id: string | undefined) {
  return useQuery({
    queryKey: ['incident', id],
    queryFn: () => incidentsApi.getIncident(id!),
    enabled: !!id,
  })
}

export function useIncidentTimeline(id: string | undefined) {
  return useQuery({
    queryKey: ['incident-timeline', id],
    queryFn: () => incidentsApi.getTimeline(id!),
    enabled: !!id,
  })
}

export function useCreateIncident() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)

  return useMutation({
    mutationFn: (data: Partial<Incident>) => incidentsApi.createIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      addNotification('Incident created successfully', 'success')
    },
    onError: () => {
      addNotification('Failed to create incident', 'error')
    },
  })
}

export function useUpdateIncident() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Incident> }) =>
      incidentsApi.updateIncident(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      queryClient.invalidateQueries({ queryKey: ['incident', data.id] })
      queryClient.invalidateQueries({ queryKey: ['incident-timeline', data.id] })
      addNotification('Incident updated successfully', 'success')
    },
    onError: () => {
      addNotification('Failed to update incident', 'error')
    },
  })
}

export function useAddTimelineEntry() {
  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IncidentTimeline> }) =>
      incidentsApi.addTimelineEntry(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['incident-timeline', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['incident', variables.id] })
      addNotification('Timeline entry added', 'success')
    },
    onError: () => {
      addNotification('Failed to add timeline entry', 'error')
    },
  })
}
