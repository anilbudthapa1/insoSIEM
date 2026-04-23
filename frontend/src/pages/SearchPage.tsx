import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Clock, Bot, ChevronRight, ChevronDown, Zap } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { searchApi } from '@/lib/api'
import { useSuggestQuery } from '@/hooks/useAI'
import { EventsTimeline } from '@/components/charts/EventsTimeline'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatDate, cn } from '@/lib/utils'
import type { SearchEvent, FieldInfo } from '@/types'

const TIME_RANGES = [
  { label: '15m', value: '15m', ms: 15 * 60 * 1000 },
  { label: '1h', value: '1h', ms: 60 * 60 * 1000 },
  { label: '4h', value: '4h', ms: 4 * 60 * 60 * 1000 },
  { label: '24h', value: '24h', ms: 24 * 60 * 60 * 1000 },
  { label: '7d', value: '7d', ms: 7 * 24 * 60 * 60 * 1000 },
]

function EventRow({ event }: { event: SearchEvent }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b border-border last:border-0">
      <div
        className="flex items-start gap-3 px-4 py-3 hover:bg-surface-elevated transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0 grid grid-cols-[140px_100px_1fr_100px] gap-3 items-start">
          <span className="font-mono text-xs text-text-muted whitespace-nowrap">
            {formatDate(event.timestamp, 'MM/dd HH:mm:ss')}
          </span>
          <span className="text-xs text-accent font-medium truncate">{event.source}</span>
          <span className="text-sm text-text-primary truncate">{event.message}</span>
          <span className="text-xs text-text-muted text-right">{event.event_type}</span>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 ml-7">
          <pre className="bg-background border border-border rounded p-3 text-xs font-mono text-green-300 overflow-x-auto max-h-48 overflow-y-auto">
            {JSON.stringify(event.raw, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [timeRange, setTimeRange] = useState('1h')
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiDescription, setAiDescription] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 50

  const suggestQuery = useSuggestQuery()

  const search = useMutation({
    mutationFn: () => {
      const now = Date.now()
      const rangeMs = TIME_RANGES.find((r) => r.value === timeRange)?.ms ?? 3600000
      return searchApi.searchEvents({
        query,
        start_time: new Date(now - rangeMs).toISOString(),
        end_time: new Date(now).toISOString(),
        limit: pageSize,
        offset: (page - 1) * pageSize,
      })
    },
  })

  const fields = useMutation({
    mutationFn: () => searchApi.getFields(),
  })

  useEffect(() => {
    if (query) {
      search.mutate()
      fields.mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    setPage(1)
    search.mutate()
    fields.mutate()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSearch()
    }
  }

  const handleAISuggest = async () => {
    if (!aiDescription.trim()) return
    const result = await suggestQuery.mutateAsync(aiDescription)
    setQuery(result.query)
    setAiModalOpen(false)
    setAiDescription('')
  }

  const handleFieldClick = (field: FieldInfo) => {
    const addition = ` ${field.name}=*`
    if (!query.includes(field.name)) {
      setQuery((q) => q + addition)
    }
  }

  const results = search.data
  const fieldList: FieldInfo[] = fields.data ?? []

  return (
    <div className="flex gap-4 h-full">
      {/* Main Search Area */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Query Bar */}
        <div className="card p-3">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='InsoQL query — e.g. source="firewall" AND severity="high"'
                  className="input-dark pl-9 w-full font-mono text-sm"
                  spellCheck={false}
                />
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="btn-secondary flex items-center gap-2 whitespace-nowrap"
                title="Generate query with AI"
              >
                <Bot className="w-4 h-4" />
                AI Suggest
              </button>
              <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap">
                {search.isPending ? <LoadingSpinner size="sm" /> : <Zap className="w-4 h-4" />}
                Search
              </button>
            </div>

            {/* Time Range */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-muted" />
              <div className="flex gap-1">
                {TIME_RANGES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setTimeRange(r.value)}
                    className={cn(
                      'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                      timeRange === r.value
                        ? 'bg-accent text-white'
                        : 'bg-surface-elevated text-text-secondary hover:bg-border',
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              {results && (
                <span className="ml-auto text-xs text-text-muted">
                  {results.total.toLocaleString()} events in {results.took_ms}ms
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Timeline Mini Chart */}
        {results?.timeline && results.timeline.length > 0 && (
          <div className="card py-2">
            <EventsTimeline data={results.timeline} height={80} mini color="#3b82f6" />
          </div>
        )}

        {/* Results */}
        <div className="card p-0 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[140px_100px_1fr_100px] gap-3 px-4 py-2 border-b border-border bg-surface">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Timestamp</span>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Source</span>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Message</span>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wide text-right">Type</span>
          </div>

          {search.isPending ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <LoadingSpinner size="lg" />
                <p className="text-text-muted text-sm">Searching events...</p>
              </div>
            </div>
          ) : search.isError ? (
            <div className="flex items-center justify-center py-16 text-danger text-sm">
              Search failed. Check your query syntax.
            </div>
          ) : !results ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center text-text-muted">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Enter a query and press Search</p>
                <p className="text-xs mt-1">Use InsoQL or click "AI Suggest" to generate a query</p>
              </div>
            </div>
          ) : results.events.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-text-muted text-sm">
              No events found for this query and time range
            </div>
          ) : (
            <div>
              {results.events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
              {results.total > pageSize && (
                <div className="px-4 py-3 border-t border-border text-xs text-text-muted flex items-center justify-between">
                  <span>Showing {results.events.length} of {results.total.toLocaleString()} events</span>
                  <button
                    onClick={() => { setPage((p) => p + 1); search.mutate() }}
                    className="btn-secondary text-xs py-1"
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Field Sidebar */}
      <div className="w-56 flex-shrink-0">
        <div className="card p-3 sticky top-0">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
            Fields ({fieldList.length})
          </h3>
          {fieldList.length === 0 ? (
            <p className="text-xs text-text-muted">Run a search to see fields</p>
          ) : (
            <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
              {fieldList.map((field) => (
                <button
                  key={field.name}
                  onClick={() => handleFieldClick(field)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-surface-elevated transition-colors group text-left"
                >
                  <span className="text-xs font-mono text-text-secondary group-hover:text-accent truncate">
                    {field.name}
                  </span>
                  <span className="text-xs text-text-muted ml-1 flex-shrink-0">{field.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Suggest Modal */}
      <Modal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title="AI Query Suggestion"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Describe in plain English what you're looking for, and AI will generate an InsoQL query.
          </p>
          <textarea
            value={aiDescription}
            onChange={(e) => setAiDescription(e.target.value)}
            rows={4}
            placeholder="e.g. Show me all failed login attempts from external IPs in the last hour..."
            className="input-dark w-full resize-none"
            autoFocus
          />
          {suggestQuery.data && (
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Generated Query</div>
              <pre className="text-xs font-mono text-accent break-all whitespace-pre-wrap">
                {suggestQuery.data.query}
              </pre>
              {suggestQuery.data.explanation && (
                <p className="text-xs text-text-secondary mt-2">{suggestQuery.data.explanation}</p>
              )}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button onClick={() => setAiModalOpen(false)} className="btn-secondary">Cancel</button>
            <button
              onClick={handleAISuggest}
              disabled={!aiDescription.trim() || suggestQuery.isPending}
              className="btn-primary flex items-center gap-2"
            >
              {suggestQuery.isPending ? <LoadingSpinner size="sm" /> : <Bot className="w-4 h-4" />}
              Generate Query
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
