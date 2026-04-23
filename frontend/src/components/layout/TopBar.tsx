import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, User, LogOut, Settings, Search } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { authApi } from '@/lib/api'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/alerts': 'Alerts',
  '/incidents': 'Incidents',
  '/search': 'Event Search',
  '/detection': 'Detection Rules',
  '/assets': 'Assets',
  '/agents': 'Agents',
  '/ai': 'AI SOC Assistant',
  '/audit-logs': 'Audit Logs',
  '/settings': 'Settings',
}

export function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const { notifications, clearNotifications } = useUIStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)

  const title = pageTitles[location.pathname] ?? 'Inso SIEM'
  const unreadCount = notifications.length

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center px-4 gap-4 flex-shrink-0 z-10">
      {/* Page Title */}
      <h1 className="text-base font-semibold text-text-primary whitespace-nowrap min-w-[140px]">
        {title}
      </h1>

      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search events, alerts, assets… (Enter to search)"
          className="input-dark pl-9 w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className={cn(
              'relative p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors',
              notifOpen && 'bg-surface-elevated text-text-primary',
            )}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-surface border border-border rounded-lg shadow-2xl z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-text-primary">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => { clearNotifications(); setNotifOpen(false) }}
                    className="text-xs text-accent hover:text-accent-hover"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-text-muted text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-4 py-3 border-b border-border last:border-0 text-sm',
                        n.type === 'error' && 'border-l-2 border-l-danger',
                        n.type === 'success' && 'border-l-2 border-l-success',
                        n.type === 'warning' && 'border-l-2 border-l-warning',
                        n.type === 'info' && 'border-l-2 border-l-accent',
                      )}
                    >
                      <p className="text-text-primary">{n.message}</p>
                      <p className="text-text-muted text-xs mt-0.5">
                        {new Date(n.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-surface-elevated transition-colors text-text-secondary hover:text-text-primary">
              <div className="w-7 h-7 bg-accent/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm text-text-primary hidden md:block">{user?.name ?? 'User'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-surface border border-border rounded-lg shadow-2xl w-48 py-1 z-50 animate-fade-in"
              align="end"
              sideOffset={4}
            >
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                <p className="text-xs text-text-muted">{user?.email}</p>
                <p className="text-xs text-accent capitalize mt-0.5">{user?.role}</p>
              </div>

              <DropdownMenu.Item asChild>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="border-t border-border my-1" />

              <DropdownMenu.Item asChild>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
