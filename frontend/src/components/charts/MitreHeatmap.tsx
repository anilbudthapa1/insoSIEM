import { cn } from '@/lib/utils'
import type { MitreHeatmap as MitreHeatmapType } from '@/types'

const MITRE_TACTICS = [
  { id: 'TA0001', name: 'Initial Access' },
  { id: 'TA0002', name: 'Execution' },
  { id: 'TA0003', name: 'Persistence' },
  { id: 'TA0004', name: 'Privilege Escalation' },
  { id: 'TA0005', name: 'Defense Evasion' },
  { id: 'TA0006', name: 'Credential Access' },
  { id: 'TA0007', name: 'Discovery' },
  { id: 'TA0008', name: 'Lateral Movement' },
  { id: 'TA0009', name: 'Collection' },
  { id: 'TA0010', name: 'Exfiltration' },
  { id: 'TA0011', name: 'C2' },
  { id: 'TA0040', name: 'Impact' },
]

interface MitreHeatmapProps {
  data?: MitreHeatmapType
  loading?: boolean
}

function getHeatColor(count: number): string {
  if (count === 0) return 'bg-surface-elevated text-text-muted border-border'
  if (count >= 20) return 'bg-red-900/70 text-red-200 border-red-700/60'
  if (count >= 10) return 'bg-orange-900/70 text-orange-200 border-orange-700/60'
  if (count >= 5) return 'bg-yellow-900/70 text-yellow-200 border-yellow-700/60'
  if (count >= 1) return 'bg-blue-900/70 text-blue-200 border-blue-700/60'
  return 'bg-surface-elevated text-text-muted border-border'
}

export function MitreHeatmap({ data, loading }: MitreHeatmapProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-14 bg-surface-elevated rounded animate-pulse" />
        ))}
      </div>
    )
  }

  const tacticsMap = new Map(
    data?.tactics.map((t) => [t.id, t]) ?? [],
  )

  return (
    <div>
      <div className="grid grid-cols-4 gap-1.5">
        {MITRE_TACTICS.map((tactic) => {
          const tacticData = tacticsMap.get(tactic.id)
          const count = tacticData?.count ?? 0

          return (
            <div
              key={tactic.id}
              className={cn(
                'border rounded p-2 text-center cursor-default transition-opacity hover:opacity-80',
                getHeatColor(count),
              )}
              title={`${tactic.name}: ${count} detections`}
            >
              <div className="text-[10px] font-mono opacity-60">{tactic.id}</div>
              <div className="text-xs font-medium leading-tight mt-0.5 truncate">{tactic.name}</div>
              <div className="text-sm font-bold mt-1">{count}</div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
        <span>Coverage:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-surface-elevated border border-border rounded" />
          <span>None</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-900/70 border border-blue-700/60 rounded" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-900/70 border border-yellow-700/60 rounded" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-900/70 border border-orange-700/60 rounded" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-900/70 border border-red-700/60 rounded" />
          <span>Critical</span>
        </div>
      </div>
    </div>
  )
}
