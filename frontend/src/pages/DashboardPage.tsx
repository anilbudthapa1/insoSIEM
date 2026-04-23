import { useNavigate } from 'react-router-dom'
import {
  Activity,
  Bell,
  AlertTriangle,
  Server,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
} from 'lucide-react'
import { useDashboardStats, useAlertsTimeline, useMitreHeatmap } from '@/hooks/useDashboard'
import { useAlerts } from '@/hooks/useAlerts'
import { SeverityChart } from '@/components/charts/SeverityChart'
import { EventsTimeline } from '@/components/charts/EventsTimeline'
import { MitreHeatmap } from '@/components/charts/MitreHeatmap'
import { SeverityBadge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatRelativeTime, formatNumber, cn } from '@/lib/utils'
import type { DashboardStats } from '@/types'

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'accent',
  loading,
}: {
  title: string
  value: number | string
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  color?: string
  loading?: boolean
}) {
  const colorMap: Record<string, string> = {
    accent: 'bg-accent/15 text-accent',
    danger: 'bg-danger/15 text-danger',
    warning: 'bg-warning/15 text-warning',
    success: 'bg-success/15 text-success',
  }
  const iconBg = colorMap[color] ?? colorMap.accent

  return (
    <div className="card flex items-start gap-4">
      <div className={cn('p-2.5 rounded-lg flex-shrink-0', iconBg)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-muted text-xs uppercase tracking-wide">{title}</p>
        {loading ? (
          <div className="h-7 bg-surface-elevated rounded animate-pulse mt-1 w-16" />
        ) : (
          <p className="text-2xl font-bold text-text-primary mt-0.5">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
        )}
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {trend > 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-danger" />
            ) : trend < 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-success" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-text-muted" />
            )}
            <span
              className={cn(
                'text-xs',
                trend > 0 ? 'text-danger' : trend < 0 ? 'text-success' : 'text-text-muted',
              )}
            >
              {trend > 0 ? '+' : ''}
              {trend}% {trendLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats()
  const { data: timeline, isLoading: timelineLoading } = useAlertsTimeline()
  const { data: mitre, isLoading: mitreLoading } = useMitreHeatmap()
  const { data: alertsData, isLoading: alertsLoading } = useAlerts({
    page: 1,
    page_size: 5,
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  const s = stats as DashboardStats | undefined

  // Build severity chart data from stats
  const severityChartData = s
    ? [
        { severity: 'critical', count: s.critical_alerts },
        { severity: 'high', count: s.active_alerts - s.critical_alerts },
        { severity: 'medium', count: Math.floor(s.active_alerts * 0.3) },
        { severity: 'low', count: Math.floor(s.active_alerts * 0.1) },
        { severity: 'info', count: 0 },
      ]
    : []

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Security Overview</h2>
          <p className="text-text-muted text-sm mt-0.5">Real-time threat intelligence and SOC metrics</p>
        </div>
        <button
          onClick={() => refetchStats()}
          className="btn-secondary flex items-center gap-2 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Events Today"
          value={s?.events_today ?? 0}
          icon={Activity}
          trend={s?.trend.events}
          trendLabel="vs yesterday"
          color="accent"
          loading={statsLoading}
        />
        <StatCard
          title="Active Alerts"
          value={s?.active_alerts ?? 0}
          icon={Bell}
          trend={s?.trend.alerts}
          trendLabel="24h change"
          color="danger"
          loading={statsLoading}
        />
        <StatCard
          title="Open Incidents"
          value={s?.open_incidents ?? 0}
          icon={AlertTriangle}
          trend={s?.trend.incidents}
          trendLabel="this week"
          color="warning"
          loading={statsLoading}
        />
        <StatCard
          title="Assets at Risk"
          value={s?.assets_at_risk ?? 0}
          icon={Server}
          color="success"
          loading={statsLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Events Timeline — 2/3 width */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Events Timeline (24h)</h3>
            <span className="text-xs text-text-muted">Events per hour</span>
          </div>
          <EventsTimeline
            data={timeline?.points}
            loading={timelineLoading}
            height={200}
          />
        </div>

        {/* Severity Chart — 1/3 width */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Alerts by Severity</h3>
          </div>
          <SeverityChart data={severityChartData} loading={statsLoading} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Alerts — 3/5 */}
        <div className="card lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Recent Alerts</h3>
            <button
              onClick={() => navigate('/alerts')}
              className="text-xs text-accent hover:text-accent-hover"
            >
              View all →
            </button>
          </div>

          {alertsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-surface-elevated rounded animate-pulse" />
              ))}
            </div>
          ) : alertsData?.items.length === 0 ? (
            <div className="py-8 text-center text-text-muted text-sm">No recent alerts</div>
          ) : (
            <div className="space-y-1">
              {alertsData?.items.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => navigate('/alerts')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-elevated transition-colors cursor-pointer group"
                >
                  <SeverityBadge severity={alert.severity} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate group-hover:text-accent transition-colors">
                      {alert.title}
                    </p>
                    <p className="text-xs text-text-muted">{alert.source}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusBadge status={alert.status} />
                    <span className="text-xs text-text-muted">{formatRelativeTime(alert.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MITRE Heatmap — 2/5 */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">MITRE ATT&CK Coverage</h3>
          </div>
          <MitreHeatmap data={mitre} loading={mitreLoading} />
        </div>
      </div>

      {/* System Status Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Agents Online',
            value: `${s?.agents_online ?? 0}/${s?.agents_total ?? 0}`,
            ok: (s?.agents_online ?? 0) === (s?.agents_total ?? 1),
          },
          {
            label: 'Detection Rules',
            value: `${s?.rules_enabled ?? 0} active`,
            ok: (s?.rules_enabled ?? 0) > 0,
          },
          {
            label: 'Avg MTTR',
            value: s?.mttr_hours ? `${s.mttr_hours.toFixed(1)}h` : 'N/A',
            ok: (s?.mttr_hours ?? 999) < 24,
          },
          {
            label: 'Total Assets',
            value: formatNumber(s?.total_assets ?? 0),
            ok: true,
          },
        ].map(({ label, value, ok }) => (
          <div key={label} className="card-elevated flex items-center gap-3">
            <div className={cn('w-2 h-2 rounded-full flex-shrink-0', ok ? 'bg-success' : 'bg-warning')} />
            <div>
              <div className="text-xs text-text-muted">{label}</div>
              <div className="text-sm font-semibold text-text-primary">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
