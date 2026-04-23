import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { severityChartColor } from '@/lib/utils'

interface SeverityData {
  severity: string
  count: number
}

interface SeverityChartProps {
  data?: SeverityData[]
  loading?: boolean
}

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low', 'info']

const defaultData: SeverityData[] = SEVERITY_ORDER.map((s) => ({ severity: s, count: 0 }))

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) => {
  if (active && payload && payload.length) {
    const item = payload[0]
    return (
      <div className="bg-surface border border-border rounded px-3 py-2 shadow-xl text-sm">
        <p className="text-text-secondary capitalize">{item.name}</p>
        <p className="text-text-primary font-semibold">{item.value} alerts</p>
      </div>
    )
  }
  return null
}

export function SeverityChart({ data, loading }: SeverityChartProps) {
  const chartData = data?.length
    ? SEVERITY_ORDER.map((s) => ({
        severity: s,
        count: data.find((d) => d.severity === s)?.count ?? 0,
      }))
    : defaultData

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="text-text-muted text-sm">Loading chart...</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" vertical={false} />
        <XAxis
          dataKey="severity"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
        />
        <Bar dataKey="count" name="severity" radius={[3, 3, 0, 0]}>
          {chartData.map((entry) => (
            <Cell
              key={entry.severity}
              fill={severityChartColor(entry.severity)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
