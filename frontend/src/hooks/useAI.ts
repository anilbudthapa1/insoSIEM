import { useQuery, useMutation } from '@tanstack/react-query'
import { aiApi } from '@/lib/api'
import type { ChatMessage } from '@/types'
import { useUIStore } from '@/store/uiStore'

export function useAIStatus() {
  return useQuery({
    queryKey: ['ai-status'],
    queryFn: () => aiApi.getAIStatus(),
    refetchInterval: 30_000,
  })
}

export function useAnalyzeAlert() {
  const addNotification = useUIStore((s) => s.addNotification)

  return useMutation({
    mutationFn: (alertId: string) => aiApi.analyzeAlert(alertId),
    onError: () => {
      addNotification('AI analysis failed. Check your AI configuration.', 'error')
    },
  })
}

export function useAIChat() {
  const addNotification = useUIStore((s) => s.addNotification)

  return useMutation({
    mutationFn: ({ messages, alertId }: { messages: ChatMessage[]; alertId?: string }) =>
      aiApi.chat(messages, alertId),
    onError: () => {
      addNotification('AI chat request failed', 'error')
    },
  })
}

export function useSuggestQuery() {
  const addNotification = useUIStore((s) => s.addNotification)

  return useMutation({
    mutationFn: (description: string) => aiApi.suggestQuery(description),
    onError: () => {
      addNotification('Failed to generate query suggestion', 'error')
    },
  })
}
