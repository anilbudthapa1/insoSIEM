import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getOverview(),
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
}

export function useAlertsTimeline() {
  return useQuery({
    queryKey: ['alerts-timeline'],
    queryFn: () => dashboardApi.getAlertsTimeline(),
    refetchInterval: 60_000,
  })
}

export function useMitreHeatmap() {
  return useQuery({
    queryKey: ['mitre-heatmap'],
    queryFn: () => dashboardApi.getMitreHeatmap(),
    staleTime: 5 * 60_000,
  })
}
