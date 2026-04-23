import { useEffect, useState } from 'react'
import { Activity, CheckCircle, Clock, Link2, MessageSquare, Save } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { SeverityBadge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAddTimelineEntry, useIncident, useIncidentTimeline, useUpdateIncident } from '@/hooks/useIncidents'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'
import type { Incident, IncidentStatus, IncidentTimeline } from '@/types'

interface IncidentDetailModalProps {
  incident: Incident | null
  open: boolean
  onClose: () => void
}

const STATUSES: IncidentStatus[] = ['open', 'investigating', 'contained', 'resolved', 'closed']

function timelineIcon(entry: IncidentTimeline) {
  const iconClass = 'w-4 h-4'
  if (entry.event_type === 'note') return <MessageSquare className={iconClass} />
  if (entry.event_type === 'alert_linked') return <Link2 className={iconClass} />
  if (entry.event_type === 'status_change') return <CheckCircle className={iconClass} />
  return <Activity className={iconClass} />
}

export function IncidentDetailModal({ incident, open, onClose }: IncidentDetailModalProps) {
  const [statusDraft, setStatusDraft] = useState<IncidentStatus>('open')
  const [note, setNote] = useState('')

  const { data: freshIncident, isLoading: incidentLoading } = useIncident(open ? incident?.id : undefined)
  const currentIncident = freshIncident ?? incident
  const { data: timeline = [], isLoading: timelineLoading } = useIncidentTimeline(
    open ? currentIncident?.id : undefined,
  )
  const updateIncident = useUpdateIncident()
  const addTimelineEntry = useAddTimelineEntry()

  useEffect(() => {
    if (currentIncident?.status) {
      setStatusDraft(currentIncident.status)
    }
  }, [currentIncident?.id, currentIncident?.status])

  if (!currentIncident) return null

  const hasStatusChanged = statusDraft !== currentIncident.status

  const handleStatusSave = async () => {
    if (!hasStatusChanged) return
    await updateIncident.mutateAsync({
      id: currentIncident.id,
      data: { status: statusDraft },
    })
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = note.trim()
    if (!content) return

    await addTimelineEntry.mutateAsync({
      id: currentIncident.id,
      data: { event_type: 'note', content },
    })
    setNote('')
  }

  return (
    <Modal open={open} onClose={onClose} size="xl" title="Incident Details">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-text-primary leading-tight">{currentIncident.title}</h2>
            {currentIncident.description && (
              <p className="text-sm text-text-secondary mt-1">{currentIncident.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <SeverityBadge severity={currentIncident.severity} />
            <StatusBadge status={currentIncident.status} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            { label: 'Created', value: formatDate(currentIncident.created_at) },
            { label: 'Updated', value: formatRelativeTime(currentIncident.updated_at) },
            { label: 'Resolved', value: currentIncident.resolved_at ? formatDate(currentIncident.resolved_at) : '-' },
            { label: 'Linked alerts', value: String(currentIncident.alert_count ?? currentIncident.alert_ids.length) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-surface-elevated rounded p-2 border border-border">
              <div className="text-text-muted text-xs uppercase tracking-wide">{label}</div>
              <div className="text-text-primary font-medium mt-0.5 truncate" title={value}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Clock className="w-4 h-4 text-accent" />
                Timeline
              </div>
              {timelineLoading && <LoadingSpinner size="sm" />}
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {timeline.length === 0 && !timelineLoading ? (
                <div className="border border-border rounded-lg p-4 text-sm text-text-muted">
                  No timeline entries yet.
                </div>
              ) : (
                timeline.map((entry) => (
                  <div key={entry.id} className="flex gap-3 border border-border rounded-lg p-3 bg-surface-elevated">
                    <div
                      className={cn(
                        'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border',
                        entry.event_type === 'status_change'
                          ? 'bg-green-900/30 text-green-300 border-green-700/50'
                          : entry.event_type === 'alert_linked'
                            ? 'bg-blue-900/30 text-blue-300 border-blue-700/50'
                            : 'bg-accent/15 text-accent border-accent/30',
                      )}
                    >
                      {timelineIcon(entry)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                          {entry.event_type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-text-muted">{formatRelativeTime(entry.created_at)}</span>
                      </div>
                      <p className="text-sm text-text-primary mt-1 whitespace-pre-wrap">{entry.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="border border-border rounded-lg p-4 bg-surface-elevated space-y-3">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Status
              </label>
              <div className="flex gap-2">
                <select
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value as IncidentStatus)}
                  className="input-dark flex-1"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusSave}
                  disabled={!hasStatusChanged || updateIncident.isPending || incidentLoading}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {updateIncident.isPending ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </div>

            <form onSubmit={handleAddNote} className="border border-border rounded-lg p-4 bg-surface-elevated space-y-3">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                placeholder="Add investigation notes, actions, or evidence..."
                className="input-dark w-full resize-none"
              />
              <button
                type="submit"
                disabled={!note.trim() || addTimelineEntry.isPending}
                className="btn-secondary inline-flex items-center gap-2 w-full justify-center"
              >
                {addTimelineEntry.isPending ? <LoadingSpinner size="sm" /> : <MessageSquare className="w-4 h-4" />}
                Add Note
              </button>
            </form>

            {currentIncident.alert_ids.length > 0 && (
              <div className="border border-border rounded-lg p-4 bg-surface-elevated">
                <div className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                  <Link2 className="w-4 h-4 text-accent" />
                  Linked Alerts
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {currentIncident.alert_ids.map((alertId) => (
                    <div key={alertId} className="text-xs text-text-secondary font-mono truncate" title={alertId}>
                      {alertId}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </Modal>
  )
}
