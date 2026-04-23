import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification } from '@/types'

interface UIState {
  sidebarCollapsed: boolean
  theme: 'dark'
  notifications: Notification[]
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  addNotification: (message: string, type: Notification['type']) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'dark',
      notifications: [],

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed: boolean) =>
        set({ sidebarCollapsed: collapsed }),

      addNotification: (message: string, type: Notification['type']) => {
        const notification: Notification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          message,
          type,
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
        }))
        // Auto-remove after 5s
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== notification.id),
          }))
        }, 5000)
      },

      removeNotification: (id: string) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'inso-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    },
  ),
)
