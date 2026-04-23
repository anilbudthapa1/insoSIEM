import { useState } from 'react'
import { Server, X, Shield, Clock, AlertTriangle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { assetsApi } from '@/lib/api'
import { DataTable, Pagination } from '@/components/ui/DataTable'
import { SeverityBadge } from '@/components/ui/Badge'
import { SearchInput } from '@/components/ui/SearchInput'
import { formatRelativeTime, riskScoreColor, cn } from '@/lib/utils'
import type { Asset, AssetType, AssetCriticality } from '@/types'

const ASSET_TYPES: AssetType[] = ['server', 'workstation', 'network', 'cloud', 'container', 'other']

function RiskBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full',
            score >= 80 ? 'bg-red-500' :
            score >= 60 ? 'bg-orange-500' :
            score >= 40 ? 'bg-yellow-500' :
            score >= 20 ? 'bg-blue-500' : 'bg-green-500',
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn('text-xs font-bold font-mono', riskScoreColor(score))}>
        {score}
      </span>
    </div>
  )
}

function AssetDetailPanel({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  return (
    <div className="w-80 flex-shrink-0 card h-fit sticky top-0 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Asset Details</h3>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center">
          <Server className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="font-semibold text-text-primary">{asset.hostname}</p>
          <p className="text-xs text-text-muted">{asset.asset_type}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">Risk Score</div>
          <RiskBar score={asset.risk_score} />
        </div>

        {[
          { label: 'IP Addresses', value: asset.ip_addresses.join(', ') || '—' },
          { label: 'OS', value: asset.os ?? '—' },
          { label: 'OS Version', value: asset.os_version ?? '—' },
          { label: 'Criticality', value: asset.criticality },
          { label: 'Owner', value: asset.owner ?? '—' },
          { label: 'Location', value: asset.location ?? '—' },
          { label: 'Agent ID', value: asset.agent_id ?? 'None' },
        ].map(({ label, value }) => (
          <div key={label} className="border-b border-border pb-2 last:border-0">
            <div className="text-xs text-text-muted">{label}</div>
            <div className="text-sm text-text-primary font-medium mt-0.5">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface-elevated rounded p-2 text-center border border-border">
          <AlertTriangle className="w-4 h-4 text-warning mx-auto mb-1" />
          <div className="text-lg font-bold text-text-primary">{asset.open_alerts}</div>
          <div className="text-xs text-text-muted">Open Alerts</div>
        </div>
        <div className="bg-surface-elevated rounded p-2 text-center border border-border">
          <Clock className="w-4 h-4 text-accent mx-auto mb-1" />
          <div className="text-xs font-semibold text-text-primary mt-1">
            {formatRelativeTime(asset.last_seen)}
          </div>
          <div className="text-xs text-text-muted">Last Seen</div>
        </div>
      </div>

      {asset.tags.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">Tags</div>
          <div className="flex flex-wrap gap-1.5">
            {asset.tags.map((tag) => (
              <span key={tag} className="bg-surface-elevated text-text-secondary text-xs px-2 py-0.5 rounded border border-border">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function AssetsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<AssetType[]>([])
  const [selectedCriticality, setSelectedCriticality] = useState<AssetCriticality[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['assets', page, pageSize, search, selectedTypes, selectedCriticality],
    queryFn: () =>
      assetsApi.getAssets({
        page,
        page_size: pageSize,
        search: search || undefined,
        asset_type: selectedTypes.length ? selectedTypes : undefined,
        criticality: selectedCriticality.length ? selectedCriticality : undefined,
      }),
  })

  const statsData = data?.items ?? []
  const criticalCount = statsData.filter((a) => a.criticality === 'critical').length
  const atRiskCount = statsData.filter((a) => a.risk_score >= 60).length

  const columns = [
    {
      key: 'hostname',
      header: 'Hostname',
      sortable: true,
      render: (row: Asset) => (
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-text-muted flex-shrink-0" />
          <div>
            <p className="text-text-primary font-medium text-sm">{row.hostname}</p>
            {row.os && <p className="text-text-muted text-xs">{row.os}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'ip_addresses',
      header: 'IP Addresses',
      render: (row: Asset) => (
        <div className="space-y-0.5">
          {row.ip_addresses.slice(0, 2).map((ip) => (
            <div key={ip} className="text-xs font-mono text-text-secondary">{ip}</div>
          ))}
          {row.ip_addresses.length > 2 && (
            <div className="text-xs text-text-muted">+{row.ip_addresses.length - 2} more</div>
          )}
        </div>
      ),
    },
    {
      key: 'asset_type',
      header: 'Type',
      width: 'w-24',
      sortable: true,
      render: (row: Asset) => (
        <span className="text-xs text-text-secondary capitalize bg-surface-elevated px-2 py-0.5 rounded border border-border">
          {row.asset_type}
        </span>
      ),
    },
    {
      key: 'criticality',
      header: 'Criticality',
      width: 'w-24',
      sortable: true,
      render: (row: Asset) => <SeverityBadge severity={row.criticality} />,
    },
    {
      key: 'risk_score',
      header: 'Risk Score',
      width: 'w-32',
      sortable: true,
      render: (row: Asset) => <RiskBar score={row.risk_score} />,
    },
    {
      key: 'open_alerts',
      header: 'Alerts',
      width: 'w-16',
      sortable: true,
      render: (row: Asset) => (
        <span className={cn('text-sm font-mono', row.open_alerts > 0 ? 'text-warning' : 'text-text-muted')}>
          {row.open_alerts}
        </span>
      ),
    },
    {
      key: 'last_seen',
      header: 'Last Seen',
      sortable: true,
      width: 'w-28',
      render: (row: Asset) => (
        <span className="text-text-muted text-xs">{formatRelativeTime(row.last_seen)}</span>
      ),
    },
  ]

  const CRITICALITIES: AssetCriticality[] = ['critical', 'high', 'medium', 'low']

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Assets', value: data?.total ?? 0, icon: Server, color: 'text-accent' },
          { label: 'Critical Assets', value: criticalCount, icon: Shield, color: 'text-red-400' },
          { label: 'At Risk (Score ≥60)', value: atRiskCount, icon: AlertTriangle, color: 'text-warning' },
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

      {/* Toolbar */}
      <div className="card p-3 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1) }}
            placeholder="Search by hostname, IP..."
            className="flex-1 min-w-[200px] max-w-sm"
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Type</div>
            <div className="flex flex-wrap gap-1.5">
              {ASSET_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    setSelectedTypes((prev) =>
                      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
                    )
                  }
                  className={cn(
                    'text-xs px-2 py-1 rounded border capitalize transition-colors',
                    selectedTypes.includes(t)
                      ? 'bg-accent/20 text-accent border-accent/40'
                      : 'bg-surface-elevated text-text-muted border-border',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Criticality</div>
            <div className="flex flex-wrap gap-1.5">
              {CRITICALITIES.map((c) => (
                <button
                  key={c}
                  onClick={() =>
                    setSelectedCriticality((prev) =>
                      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
                    )
                  }
                  className={cn(
                    'text-xs px-2 py-1 rounded border capitalize transition-colors',
                    selectedCriticality.includes(c)
                      ? 'bg-accent/20 text-accent border-accent/40'
                      : 'bg-surface-elevated text-text-muted border-border',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content with optional side panel */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="card p-0 overflow-hidden">
            <DataTable<Asset>
              columns={columns}
              data={data?.items ?? []}
              loading={isLoading}
              onRowClick={setSelectedAsset}
              keyExtractor={(row) => row.id}
              emptyMessage="No assets found"
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
        </div>

        {selectedAsset && (
          <AssetDetailPanel
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
          />
        )}
      </div>
    </div>
  )
}
