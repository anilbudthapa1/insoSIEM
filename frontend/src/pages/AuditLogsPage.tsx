import { useState } from 'react'
import { Download, FileClock, ShieldCheck } from 'lucide-react'
import { useAuditLogs, useExportAuditLogs } from '@/hooks/useAudit'
import { DataTable, Pagination } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { SearchInput } from '@/components/ui/SearchInput'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatRelativeTime, cn } from '@/lib/utils'
import type { AuditLog, AuditLogFilters } from '@/types'

const OUTCOMES = ['success', 'failure', 'error']

function outcomeVariant(outcome: string) {
  if (outcome === 'success') return 'success'
  if (outcome === 'failure') return 'warning'
  if (outcome === 'error') return 'danger'
  return 'default'
}

export function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [selectedOutcome, setSelectedOutcome] = useState('')
  const [resourceType, setResourceType] = useState('')

  const filters: AuditLogFilters = {
    page,
    page_size: pageSize,
    status: selectedOutcome || undefined,
    resource_type: resourceType || undefined,
  }

  const { data, isLoading } = useAuditLogs(filters)
  const exportLogs = useExportAuditLogs()

  const columns = [
    {
      key: 'created_at',
      header: 'Time',
      sortable: true,
      width: 'w-36',
      render: (row: AuditLog) => (
        <span className="text-xs text-text-muted" title={new Date(row.created_at).toLocaleString()}>
          {formatRelativeTime(row.created_at)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Outcome',
      width: 'w-28',
      sortable: true,
      render: (row: AuditLog) => (
        <Badge variant={outcomeVariant(row.status)} className="capitalize">
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      render: (row: AuditLog) => (
        <span className="text-sm font-medium text-text-primary">{row.action}</span>
      ),
    },
    {
      key: 'resource_type',
      header: 'Resource',
      sortable: true,
      render: (row: AuditLog) => (
        <div className="min-w-0">
          <p className="text-sm text-text-secondary">{row.resource_type ?? '-'}</p>
          {row.resource_id && (
            <p className="text-xs text-text-muted font-mono truncate max-w-[220px]" title={row.resource_id}>
              {row.resource_id}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'user_id',
      header: 'Actor',
      render: (row: AuditLog) => (
        <span className="text-xs text-text-secondary font-mono truncate block max-w-[180px]" title={row.user_id}>
          {row.user_id ?? 'system'}
        </span>
      ),
    },
    {
      key: 'ip_address',
      header: 'IP',
      width: 'w-32',
      render: (row: AuditLog) => (
        <span className="text-xs text-text-muted font-mono">{row.ip_address ?? '-'}</span>
      ),
    },
  ]

  const filteredItems = (data?.items ?? []).filter((row) => {
    const needle = search.toLowerCase()
    return (
      !needle ||
      row.action.toLowerCase().includes(needle) ||
      (row.resource_type ?? '').toLowerCase().includes(needle) ||
      (row.resource_id ?? '').toLowerCase().includes(needle) ||
      (row.user_id ?? '').toLowerCase().includes(needle)
    )
  })

  const successCount = filteredItems.filter((row) => row.status === 'success').length
  const issueCount = filteredItems.filter((row) => row.status !== 'success').length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Visible Events', value: filteredItems.length, icon: FileClock, color: 'text-accent' },
          { label: 'Successful', value: successCount, icon: ShieldCheck, color: 'text-success' },
          { label: 'Needs Review', value: issueCount, icon: FileClock, color: 'text-warning' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-3">
            <Icon className={cn('w-8 h-8', color)} />
            <div>
              <div className="text-2xl font-bold text-text-primary">{value}</div>
              <div className="text-xs text-text-muted">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-3">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1) }}
            placeholder="Search audit action, resource, user..."
            className="flex-1 min-w-[220px] max-w-sm"
          />
          <input
            value={resourceType}
            onChange={(e) => { setResourceType(e.target.value); setPage(1) }}
            placeholder="resource type"
            className="input-dark w-40"
          />
          <div className="flex gap-2 flex-wrap">
            {OUTCOMES.map((outcome) => (
              <button
                key={outcome}
                onClick={() => { setSelectedOutcome((prev) => prev === outcome ? '' : outcome); setPage(1) }}
                className={cn(
                  'text-xs px-2 py-1 rounded border capitalize transition-colors',
                  selectedOutcome === outcome
                    ? 'bg-accent/20 text-accent border-accent/40'
                    : 'bg-surface-elevated text-text-muted border-border',
                )}
              >
                {outcome}
              </button>
            ))}
          </div>
          <button
            onClick={() => exportLogs.mutate(filters)}
            disabled={exportLogs.isPending}
            className="btn-secondary inline-flex items-center gap-2 ml-auto"
          >
            {exportLogs.isPending ? <LoadingSpinner size="sm" /> : <Download className="w-4 h-4" />}
            Export
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <DataTable<AuditLog>
          columns={columns}
          data={filteredItems}
          loading={isLoading}
          keyExtractor={(row) => row.id}
          emptyMessage="No audit logs found"
        />
        {data && (
          <Pagination
            page={page}
            totalPages={data.total_pages}
            pageSize={pageSize}
            total={data.total}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
          />
        )}
      </div>
    </div>
  )
}
