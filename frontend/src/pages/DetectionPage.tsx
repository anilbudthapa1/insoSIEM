import { useState } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { detectionApi } from '@/lib/api'
import { CreateRuleModal } from '@/components/detection/CreateRuleModal'
import { DataTable, Pagination } from '@/components/ui/DataTable'
import { SeverityBadge } from '@/components/ui/Badge'
import { SearchInput } from '@/components/ui/SearchInput'
import { formatRelativeTime, cn } from '@/lib/utils'
import type { DetectionRule, RuleType, RuleStatus } from '@/types'
import { useUIStore } from '@/store/uiStore'

const RULE_TYPES: Array<{ value: RuleType | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'sigma', label: 'Sigma' },
  { value: 'threshold', label: 'Threshold' },
  { value: 'ml', label: 'ML' },
  { value: 'custom', label: 'Custom' },
]

const TYPE_COLORS: Record<RuleType, string> = {
  sigma: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
  threshold: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
  ml: 'bg-green-900/40 text-green-300 border-green-700/50',
  custom: 'bg-gray-800/40 text-gray-300 border-gray-700/50',
}

export function DetectionPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<RuleType | 'all'>('all')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editRule, setEditRule] = useState<DetectionRule | null>(null)

  const queryClient = useQueryClient()
  const addNotification = useUIStore((s) => s.addNotification)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['detection-rules', page, pageSize, search, activeTab],
    queryFn: () =>
      detectionApi.getRules({
        page,
        page_size: pageSize,
        search: search || undefined,
        rule_type: activeTab !== 'all' ? [activeTab] : undefined,
      }),
  })

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RuleStatus }) =>
      detectionApi.updateRule(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detection-rules'] })
      addNotification('Rule status updated', 'success')
    },
    onError: () => addNotification('Failed to update rule', 'error'),
  })

  const deleteRule = useMutation({
    mutationFn: (id: string) => detectionApi.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detection-rules'] })
      addNotification('Rule deleted', 'success')
    },
    onError: () => addNotification('Failed to delete rule', 'error'),
  })

  const columns = [
    {
      key: 'name',
      header: 'Rule Name',
      sortable: true,
      render: (row: DetectionRule) => (
        <div>
          <p className="text-text-primary font-medium text-sm">{row.name}</p>
          {row.description && (
            <p className="text-text-muted text-xs mt-0.5 truncate max-w-xs">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'rule_type',
      header: 'Type',
      width: 'w-24',
      render: (row: DetectionRule) => (
        <span className={cn('text-xs px-2 py-0.5 rounded border font-medium uppercase', TYPE_COLORS[row.rule_type])}>
          {row.rule_type}
        </span>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      width: 'w-24',
      sortable: true,
      render: (row: DetectionRule) => <SeverityBadge severity={row.severity} />,
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-24',
      render: (row: DetectionRule) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            const newStatus: RuleStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
            toggleStatus.mutate({ id: row.id, status: newStatus })
          }}
          className="flex items-center gap-1.5 text-xs"
          disabled={toggleStatus.isPending}
        >
          {row.status === 'enabled' ? (
            <>
              <ToggleRight className="w-5 h-5 text-success" />
              <span className="text-success">Enabled</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5 text-text-muted" />
              <span className="text-text-muted">Disabled</span>
            </>
          )}
        </button>
      ),
    },
    {
      key: 'mitre_tactics',
      header: 'MITRE Tactics',
      render: (row: DetectionRule) => (
        <div className="flex flex-wrap gap-1">
          {row.mitre_tactics.slice(0, 2).map((t) => (
            <span key={t} className="bg-accent/15 text-accent text-[10px] px-1.5 py-0.5 rounded border border-accent/30">
              {t.length > 15 ? t.slice(0, 14) + '…' : t}
            </span>
          ))}
          {row.mitre_tactics.length > 2 && (
            <span className="text-xs text-text-muted">+{row.mitre_tactics.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: 'trigger_count',
      header: 'Triggers',
      width: 'w-20',
      sortable: true,
      render: (row: DetectionRule) => (
        <span className="text-text-secondary text-sm font-mono">{row.trigger_count}</span>
      ),
    },
    {
      key: 'updated_at',
      header: 'Modified',
      width: 'w-28',
      sortable: true,
      render: (row: DetectionRule) => (
        <span className="text-text-muted text-xs">{formatRelativeTime(row.updated_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 'w-20',
      render: (row: DetectionRule) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => { setEditRule(row); setCreateModalOpen(true) }}
            className="p-1.5 rounded text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
            title="Edit rule"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete rule "${row.name}"?`)) {
                deleteRule.mutate(row.id)
              }
            }}
            className="p-1.5 rounded text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
            title="Delete rule"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Tab bar + Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1 bg-surface rounded-lg p-1 border border-border">
          {RULE_TYPES.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setPage(1) }}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                activeTab === tab.value
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1) }}
            placeholder="Search rules..."
            className="w-60"
          />
          <button
            onClick={() => { setEditRule(null); setCreateModalOpen(true) }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Rule
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-text-muted">
        <span>{data?.total ?? 0} rules total</span>
        <span>•</span>
        <span className="text-success">{data?.items.filter(r => r.status === 'enabled').length ?? 0} enabled</span>
        <span>•</span>
        <span className="text-text-muted">{data?.items.filter(r => r.status === 'disabled').length ?? 0} disabled</span>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <DataTable<DetectionRule>
          columns={columns}
          data={data?.items ?? []}
          loading={isLoading}
          onRowClick={(row) => { setEditRule(row); setCreateModalOpen(true) }}
          keyExtractor={(row) => row.id}
          emptyMessage="No detection rules found"
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

      <CreateRuleModal
        open={createModalOpen}
        onClose={() => { setCreateModalOpen(false); setEditRule(null) }}
        onCreated={() => refetch()}
        editRule={editRule}
      />
    </div>
  )
}
