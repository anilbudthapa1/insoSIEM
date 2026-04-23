import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TableSkeleton } from './LoadingSpinner'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  keyExtractor?: (row: T) => string
  selectedRows?: Set<string>
  onSelectRow?: (id: string) => void
  onSelectAll?: (ids: string[]) => void
  className?: string
}

export function DataTable<T extends object>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  onRowClick,
  keyExtractor,
  selectedRows,
  onSelectRow,
  onSelectAll,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = String((a as Record<string, unknown>)[sortKey] ?? '')
    const bVal = String((b as Record<string, unknown>)[sortKey] ?? '')
    const cmp = aVal.localeCompare(bVal)
    return sortDir === 'asc' ? cmp : -cmp
  })

  const allIds = keyExtractor ? data.map(keyExtractor) : []
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedRows?.has(id))

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            {onSelectRow && (
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onSelectAll?.(allIds)}
                  className="accent-accent"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider select-none',
                  col.sortable && 'cursor-pointer hover:text-text-primary',
                  col.width,
                  col.className,
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="text-text-muted">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableSkeleton rows={5} cols={columns.length + (onSelectRow ? 1 : 0)} />
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onSelectRow ? 1 : 0)}
                className="px-4 py-12 text-center text-text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => {
              const id = keyExtractor ? keyExtractor(row) : String(idx)
              const isSelected = selectedRows?.has(id)
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-border transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-surface-elevated',
                    isSelected && 'bg-accent/10',
                  )}
                >
                  {onSelectRow && (
                    <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected ?? false}
                        onChange={() => onSelectRow(id)}
                        className="accent-accent"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3 text-text-primary', col.className)}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

interface PaginationProps {
  page: number
  totalPages: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function Pagination({
  page,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm text-text-secondary">
      <div className="flex items-center gap-3">
        <span>
          {start}–{end} of {total}
        </span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-surface-elevated border border-border text-text-primary rounded px-2 py-1 text-xs"
          >
            {[10, 25, 50, 100].map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="px-2 py-1 rounded hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed"
        >
          «
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 rounded hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'px-3 py-1 rounded text-sm',
                p === page
                  ? 'bg-accent text-white'
                  : 'hover:bg-surface-elevated text-text-secondary',
              )}
            >
              {p}
            </button>
          )
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-2 py-1 rounded hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ›
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="px-2 py-1 rounded hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed"
        >
          »
        </button>
      </div>
    </div>
  )
}
