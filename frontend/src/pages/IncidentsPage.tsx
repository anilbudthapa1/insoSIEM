import { useState } from 'react'
import { Plus, AlertTriangle } from 'lucide-react'
import { useIncidents, useCreateIncident } from '@/hooks/useIncidents'
import { DataTable, Pagination } from '@/components/ui/DataTable'
import { SeverityBadge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { SearchInput } from '@/components/ui/SearchInput'
import { IncidentDetailModal } from '@/components/incidents/IncidentDetailModal'
import { formatRelativeTime, cn } from '@/lib/utils'
import type { Incident, IncidentStatus, IncidentSeverity } from '@/types'

const STATUSES: IncidentStatus[] = ['open', 'investigating', 'contained', 'resolved', 'closed']

function CreateIncidentModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const createIncident = useCreateIncident()
  const [form, setForm] = useState({
    title: '',
    description: '',
    severity: 'medium' as IncidentSeverity,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return
    await createIncident.mutateAsync(form)
    onClose()
    setForm({ title: '', description: '', severity: 'medium' })
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Incident" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Incident title..."
            className="input-dark w-full"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="Describe the incident..."
            className="input-dark w-full resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
            Severity
          </label>
          <select
            value={form.severity}
            onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as IncidentSeverity }))}
            className="input-dark w-full"
          >
            {(['critical', 'high', 'medium', 'low'] as IncidentSeverity[]).map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!form.title || createIncident.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {createIncident.isPending && <LoadingSpinner size="sm" />}
            Create Incident
          </button>
        </div>
      </form>
    </Modal>
  )
}

export function IncidentsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<IncidentStatus[]>([])
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [detailIncident, setDetailIncident] = useState<Incident | null>(null)

  const { data, isLoading } = useIncidents({
    page,
    page_size: pageSize,
    status: selectedStatuses.length ? selectedStatuses : undefined,
  })

  const columns = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (row: Incident) => (
        <div>
          <p className="text-text-primary font-medium text-sm truncate max-w-xs">{row.title}</p>
          {row.description && (
            <p className="text-text-muted text-xs mt-0.5 truncate max-w-xs">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      width: 'w-24',
      sortable: true,
      render: (row: Incident) => <SeverityBadge severity={row.severity} />,
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-32',
      sortable: true,
      render: (row: Incident) => <StatusBadge status={row.status} />,
    },
    {
      key: 'assigned_to_name',
      header: 'Assigned To',
      render: (row: Incident) => (
        <span className="text-text-secondary text-sm">{row.assigned_to_name ?? '—'}</span>
      ),
    },
    {
      key: 'alert_count',
      header: 'Alerts',
      width: 'w-16',
      render: (row: Incident) => (
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
          <span className="text-text-secondary text-sm">{row.alert_count}</span>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      width: 'w-32',
      render: (row: Incident) => (
        <span className="text-text-muted text-xs">{formatRelativeTime(row.created_at)}</span>
      ),
    },
    {
      key: 'updated_at',
      header: 'Updated',
      width: 'w-32',
      render: (row: Incident) => (
        <span className="text-text-muted text-xs">{formatRelativeTime(row.updated_at)}</span>
      ),
    },
  ]

  const filteredItems = (data?.items ?? []).filter((inc) =>
    !search || inc.title.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1) }}
          placeholder="Search incidents..."
          className="flex-1 min-w-[200px] max-w-sm"
        />

        {/* Status filters */}
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() =>
                setSelectedStatuses((prev) =>
                  prev.includes(st) ? prev.filter((x) => x !== st) : [...prev, st],
                )
              }
              className={cn(
                'text-xs px-2 py-1 rounded border capitalize transition-colors',
                selectedStatuses.includes(st)
                  ? 'bg-accent/20 text-accent border-accent/40'
                  : 'bg-surface-elevated text-text-muted border-border',
              )}
            >
              {st}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2 ml-auto"
        >
          <Plus className="w-4 h-4" />
          New Incident
        </button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <DataTable<Incident>
          columns={columns}
          data={filteredItems}
          loading={isLoading}
          onRowClick={setDetailIncident}
          keyExtractor={(row) => row.id}
          emptyMessage="No incidents found"
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

      <CreateIncidentModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      <IncidentDetailModal
        incident={detailIncident}
        open={!!detailIncident}
        onClose={() => setDetailIncident(null)}
      />
    </div>
  )
}
