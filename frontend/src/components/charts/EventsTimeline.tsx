import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'

interface TimelinePoint {
  timestamp: string
  count: number
}

interface EventsTimelineProps {
  data?: TimelinePoint[]
  loading?: boolean
  height?: number
  color?: string
  mini?: boolean
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border rounded px-3 py-2 shadow-xl text-sm">
        <p className="text-text-muted text-xs">{label}</p>
        <p className="text-text-primary font-semibold">{payload[0].value} events</p>
      </div>
    )
  }
  return null
}

export function EventsTimeline({
  data,
  loading,
  height = 200,
  color = '#3b82f6',
  mini = false,
}: EventsTimelineProps) {
  const chartData =
    data?.map((p) => ({
      time: (() => {
        try {
          return format(parseISO(p.timestamp), mini ? 'HH:mm' : 'HH:mm')
        } catch {
          return p.timestamp
        }
      })(),
      count: p.count,
    })) ?? []

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-text-muted text-sm">Loading chart...</div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-text-muted text-sm">No data available</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: mini ? -30 : -20, bottom: 0 }}>
        <defs>
          <linearGradient id="eventsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fill: '#64748b', fontSize: mini ? 10 : 11 }}
          axisLine={false}
          tickLine={false}
          interval={mini ? 'preserveStartEnd' : Math.floor(chartData.length / 6)}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: mini ? 10 : 11 }}
          axisLine={false}
          tickLine={false}
        />
        {!mini && <Tooltip content={<CustomTooltip />} />}
        <Area
          type="monotone"
          dataKey="count"
          stroke={color}
          strokeWidth={2}
          fill="url(#eventsGradient)"
          dot={false}
          activeDot={mini ? false : { r: 4, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
