import { useState } from 'react'
import { Filter, CheckCheck, RefreshCw } from 'lucide-react'
import { useAlerts, useAlertStats, useBulkAcknowledgeAlerts } from '@/hooks/useAlerts'
import { AlertDetailModal } from '@/components/alerts/AlertDetailModal'
import { DataTable, Pagination } from '@/components/ui/DataTable'
import { SeverityBadge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SearchInput } from '@/components/ui/SearchInput'
import { formatRelativeTime, cn } from '@/lib/utils'
import type { Alert, AlertFilters, AlertSeverity, AlertStatus } from '@/types'

const SEVERITIES: AlertSeverity[] = ['critical', 'high', 'medium', 'low', 'info']
const STATUSES: AlertStatus[] = ['open', 'acknowledged', 'investigating', 'resolved', 'false_positive']

export function AlertsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [selectedSeverities, setSelectedSeverities] = useState<AlertSeverity[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<AlertStatus[]>([])
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [detailAlert, setDetailAlert] = useState<Alert | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filters: AlertFilters = {
    page,
    page_size: pageSize,
    search: search || undefined,
    severity: selectedSeverities.length ? selectedSeverities : undefined,
    status: selectedStatuses.length ? selectedStatuses : undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
  }

  const { data, isLoading, refetch } = useAlerts(filters)
  const { data: stats } = useAlertStats()
  const bulkAcknowledge = useBulkAcknowledgeAlerts()

  const toggleSeverity = (s: AlertSeverity) => {
    setSelectedSeverities((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    )
    setPage(1)
  }

  const toggleStatus = (s: AlertStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    )
    setPage(1)
  }

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSelectAll = (ids: string[]) => {
    if (ids.every((id) => selectedRows.has(id))) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(ids))
    }
  }

  const handleBulkAcknowledge = () => {
    if (selectedRows.size > 0) {
      bulkAcknowledge.mutate(Array.from(selectedRows), {
        onSuccess: () => setSelectedRows(new Set()),
      })
    }
  }

  const columns = [
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      width: 'w-28',
      render: (row: Alert) => <SeverityBadge severity={row.severity} />,
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (row: Alert) => (
        <div>
          <p className="text-text-primary text-sm font-medium truncate max-w-xs" title={row.title}>
            {row.title}
          </p>
          {row.rule_name && (
            <p className="text-text-muted text-xs mt-0.5">Rule: {row.rule_name}</p>
          )}
        </div>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      sortable: true,
      render: (row: Alert) => (
        <div className="text-sm">
          <p className="text-text-secondary">{row.source}</p>
          {row.source_ip && <p className="text-text-muted text-xs font-mono">{row.source_ip}</p>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: 'w-32',
      render: (row: Alert) => <StatusBadge status={row.status} />,
    },
    {
      key: 'assigned_to_name',
      header: 'Assigned To',
      render: (row: Alert) => (
        <span className="text-text-secondary text-sm">{row.assigned_to_name ?? '—'}</span>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      width: 'w-32',
      render: (row: Alert) => (
        <span className="text-text-muted text-xs">{formatRelativeTime(row.created_at)}</span>
      ),
    },
    {
      key: 'count',
      header: 'Count',
      width: 'w-16',
      render: (row: Alert) => (
        <span className="text-text-secondary text-sm font-mono">{row.count}</span>
      ),
    },
  ]

  const severityColors: Record<AlertSeverity, string> = {
    critical: 'bg-red-900/50 text-red-300 border-red-700/50',
    high: 'bg-orange-900/50 text-orange-300 border-orange-700/50',
    medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50',
    low: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
    info: 'bg-gray-800/50 text-gray-400 border-gray-700/50',
  }

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {SEVERITIES.map((sev) => {
          const count = stats?.[sev as keyof typeof stats] ?? 0
          return (
            <div key={sev} className="card-elevated flex items-center gap-2 py-2 px-3 flex-shrink-0">
              <span className={cn('text-xs font-semibold capitalize', severityColors[sev].split(' ').find(c => c.startsWith('text-')) ?? 'text-text-secondary')}>
                {sev}
              </span>
              <span className="text-text-primary font-bold">{count as number}</span>
            </div>
          )
        })}
        <button
          onClick={() => refetch()}
          className="ml-auto btn-secondary flex items-center gap-2 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Toolbar */}
      <div className="card p-3">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1) }}
            placeholder="Search alerts by title, source, IP..."
            className="flex-1 min-w-[200px] max-w-sm"
          />

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'btn-secondary flex items-center gap-2 text-xs',
              showFilters && 'bg-accent/20 text-accent border-accent/40',
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {(selectedSeverities.length + selectedStatuses.length) > 0 && (
              <span className="bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {selectedSeverities.length + selectedStatuses.length}
              </span>
            )}
          </button>

          {selectedRows.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-text-muted text-xs">{selectedRows.size} selected</span>
              <button
                onClick={handleBulkAcknowledge}
                disabled={bulkAcknowledge.isPending}
                className="btn-secondary flex items-center gap-2 text-xs"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Acknowledge
              </button>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-border space-y-3">
            <div>
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Severity</div>
              <div className="flex flex-wrap gap-2">
                {SEVERITIES.map((sev) => (
                  <button
                    key={sev}
                    onClick={() => toggleSeverity(sev)}
                    className={cn(
                      'text-xs px-2 py-1 rounded border capitalize transition-colors',
                      selectedSeverities.includes(sev)
                        ? severityColors[sev]
                        : 'bg-surface-elevated text-text-muted border-border hover:border-text-muted',
                    )}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Status</div>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((st) => (
                  <button
                    key={st}
                    onClick={() => toggleStatus(st)}
                    className={cn(
                      'text-xs px-2 py-1 rounded border capitalize transition-colors',
                      selectedStatuses.includes(st)
                        ? 'bg-accent/20 text-accent border-accent/40'
                        : 'bg-surface-elevated text-text-muted border-border hover:border-text-muted',
                    )}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            {(selectedSeverities.length + selectedStatuses.length) > 0 && (
              <button
                onClick={() => { setSelectedSeverities([]); setSelectedStatuses([]); setPage(1) }}
                className="text-xs text-accent hover:text-accent-hover"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <DataTable<Alert>
          columns={columns}
          data={data?.items ?? []}
          loading={isLoading}
          onRowClick={setDetailAlert}
          keyExtractor={(row) => row.id}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          emptyMessage="No alerts found matching your filters"
        />
        {data && (
          <Pagination
            page={page}
            totalPages={data.total_pages}
            pageSize={pageSize}
            total={data.total}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
          />
        )}
      </div>

      <AlertDetailModal
        alert={detailAlert}
        open={!!detailAlert}
        onClose={() => setDetailAlert(null)}
      />
    </div>
  )
}
