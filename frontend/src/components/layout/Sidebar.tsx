import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Bell,
  AlertTriangle,
  Search,
  Shield,
  Server,
  Cpu,
  Bot,
  Settings,
  FileClock,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/api'
import { useAlertStats } from '@/hooks/useAlerts'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alerts', icon: Bell, label: 'Alerts', badge: true },
  { to: '/incidents', icon: AlertTriangle, label: 'Incidents' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/detection', icon: Shield, label: 'Detection' },
  { to: '/assets', icon: Server, label: 'Assets' },
  { to: '/agents', icon: Cpu, label: 'Agents' },
  { to: '/ai', icon: Bot, label: 'AI Assistant' },
  { to: '/audit-logs', icon: FileClock, label: 'Audit Logs', adminOnly: true },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const { data: alertStats } = useAlertStats()

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  return (
    <aside
      className={cn(
        'flex flex-col bg-surface border-r border-border transition-all duration-200 relative z-20 flex-shrink-0',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-4 border-b border-border', collapsed && 'justify-center px-2')}>
        <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-text-primary text-base leading-tight">Inso SIEM</div>
            <div className="text-xs text-text-muted leading-tight">Security Intelligence</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, badge, adminOnly }) => {
          if (adminOnly && user?.role !== 'admin') return null
          const openAlerts = alertStats?.open ?? 0
          const showBadge = badge && openAlerts > 0

          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm font-medium transition-all duration-100 relative group',
                  isActive
                    ? 'bg-accent/15 text-accent border-l-2 border-accent -ml-0 pl-[14px]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated',
                  collapsed && 'justify-center px-0 mx-2 pl-0',
                )
              }
            >
              <div className="relative flex-shrink-0">
                <Icon className="w-5 h-5" />
                {showBadge && collapsed && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full" />
                )}
              </div>
              {!collapsed && (
                <>
                  <span className="truncate">{label}</span>
                  {showBadge && (
                    <span className="ml-auto bg-danger text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-none">
                      {openAlerts > 99 ? '99+' : openAlerts}
                    </span>
                  )}
                </>
              )}
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-elevated border border-border rounded text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {label}
                  {showBadge && <span className="ml-1 text-danger">({openAlerts})</span>}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-[72px] w-6 h-6 bg-surface-elevated border border-border rounded-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors z-30"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* User section */}
      <div className={cn('border-t border-border p-3', collapsed && 'px-2')}>
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary truncate">{user?.name ?? 'User'}</div>
              <div className="text-xs text-text-muted truncate">{user?.role ?? 'analyst'}</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-text-muted hover:text-danger transition-colors p-1 rounded"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-accent" />
            </div>
            <button
              onClick={handleLogout}
              className="text-text-muted hover:text-danger transition-colors p-1 rounded"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
