import { useState } from 'react'
import {
  AlertTriangle,
  Bot,
  CheckCircle,
  XCircle,
  User,
  PlusCircle,
  Clock,
  Shield,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { SeverityBadge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAcknowledgeAlert, useUpdateAlert } from '@/hooks/useAlerts'
import { useAnalyzeAlert } from '@/hooks/useAI'
import { useCreateIncident } from '@/hooks/useIncidents'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'
import type { Alert, AIAnalysisResponse } from '@/types'

interface AlertDetailModalProps {
  alert: Alert | null
  open: boolean
  onClose: () => void
}

export function AlertDetailModal({ alert, open, onClose }: AlertDetailModalProps) {
  const [rawExpanded, setRawExpanded] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResponse | null>(null)

  const acknowledgeAlert = useAcknowledgeAlert()
  const updateAlert = useUpdateAlert()
  const analyzeAlert = useAnalyzeAlert()
  const createIncident = useCreateIncident()

  if (!alert) return null

  const handleAcknowledge = () => {
    acknowledgeAlert.mutate(alert.id)
  }

  const handleFalsePositive = () => {
    updateAlert.mutate({ id: alert.id, data: { status: 'false_positive' } })
  }

  const handleAnalyze = async () => {
    const result = await analyzeAlert.mutateAsync(alert.id)
    setAiAnalysis(result)
  }

  const handleCreateIncident = () => {
    const incidentSeverity = alert.severity === 'info' ? 'low' : alert.severity
    createIncident.mutate({
      title: `Incident from: ${alert.title}`,
      description: alert.description,
      severity: incidentSeverity as 'critical' | 'high' | 'medium' | 'low',
      alert_ids: [alert.id],
    })
  }

  return (
    <Modal open={open} onClose={onClose} size="xl" title="Alert Details">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-text-primary leading-tight">{alert.title}</h2>
            <p className="text-text-secondary text-sm mt-1">{alert.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <SeverityBadge severity={alert.severity} />
            <StatusBadge status={alert.status} />
          </div>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            { label: 'Source', value: alert.source },
            { label: 'Source IP', value: alert.source_ip ?? '—' },
            { label: 'Dest IP', value: alert.dest_ip ?? '—' },
            { label: 'Rule', value: alert.rule_name ?? '—' },
            { label: 'First Seen', value: formatRelativeTime(alert.first_seen) },
            { label: 'Last Seen', value: formatRelativeTime(alert.last_seen) },
            { label: 'Count', value: String(alert.count) },
            { label: 'Created', value: formatDate(alert.created_at) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-surface-elevated rounded p-2 border border-border">
              <div className="text-text-muted text-xs uppercase tracking-wide">{label}</div>
              <div className="text-text-primary font-medium mt-0.5 truncate" title={value}>{value}</div>
            </div>
          ))}
        </div>

        {/* MITRE Tactics */}
        {alert.mitre_tactics.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-text-primary">MITRE ATT&CK</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {alert.mitre_tactics.map((tactic) => (
                <span
                  key={tactic}
                  className="bg-accent/15 text-accent text-xs px-2 py-1 rounded border border-accent/30 font-mono"
                >
                  {tactic}
                </span>
              ))}
              {alert.mitre_techniques?.map((tech) => (
                <span
                  key={tech}
                  className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded border border-purple-700/40 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Raw Event */}
        {alert.raw_event && (
          <div>
            <button
              onClick={() => setRawExpanded(!rawExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {rawExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              Raw Event Data
            </button>
            {rawExpanded && (
              <pre className="mt-2 bg-background border border-border rounded p-3 text-xs font-mono text-green-300 overflow-x-auto max-h-48 overflow-y-auto">
                {JSON.stringify(alert.raw_event, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* AI Analysis */}
        <div className="border border-border rounded-lg p-4 bg-surface-elevated">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-accent" />
              <span className="font-semibold text-text-primary">AI Analysis</span>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzeAlert.isPending}
              className="btn-primary flex items-center gap-2 text-xs py-1.5"
            >
              {analyzeAlert.isPending ? (
                <>
                  <LoadingSpinner size="sm" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5" />
                  Analyze with AI
                </>
              )}
            </button>
          </div>

          {aiAnalysis ? (
            <div className="space-y-4">
              {/* Summary */}
              <div>
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Summary</div>
                <p className="text-sm text-text-primary">{aiAnalysis.summary}</p>
              </div>

              {/* Risk Score */}
              <div className="flex items-center gap-3">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wide">Risk Score</div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        aiAnalysis.risk_score >= 80 ? 'bg-red-500' :
                        aiAnalysis.risk_score >= 60 ? 'bg-orange-500' :
                        aiAnalysis.risk_score >= 40 ? 'bg-yellow-500' : 'bg-green-500',
                      )}
                      style={{ width: `${aiAnalysis.risk_score}%` }}
                    />
                  </div>
                  <span className={cn(
                    'text-sm font-bold',
                    aiAnalysis.risk_score >= 80 ? 'text-red-400' :
                    aiAnalysis.risk_score >= 60 ? 'text-orange-400' :
                    aiAnalysis.risk_score >= 40 ? 'text-yellow-400' : 'text-green-400',
                  )}>
                    {aiAnalysis.risk_score}/100
                  </span>
                </div>
                <div className="text-xs text-text-muted">
                  Confidence: {Math.round(aiAnalysis.confidence * 100)}%
                </div>
              </div>

              {/* Attack Chain */}
              {aiAnalysis.attack_chain.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Attack Chain</div>
                  <div className="space-y-2">
                    {aiAnalysis.attack_chain.map((step) => (
                      <div key={step.step} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-bold">
                          {step.step}
                        </span>
                        <div>
                          <p className="text-text-primary">{step.description}</p>
                          {(step.tactic || step.technique) && (
                            <div className="flex gap-2 mt-0.5">
                              {step.tactic && (
                                <span className="text-xs text-accent/70">{step.tactic}</span>
                              )}
                              {step.technique && (
                                <span className="text-xs text-purple-400/70">{step.technique}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {aiAnalysis.recommendations.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Recommendations</div>
                  <ul className="space-y-1.5">
                    {aiAnalysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2 text-sm text-text-secondary">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* IOCs */}
              {aiAnalysis.iocs && aiAnalysis.iocs.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">IOCs</div>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.iocs.map((ioc, i) => (
                      <div key={i} className="bg-background border border-border rounded px-2 py-1 text-xs">
                        <span className="text-text-muted">{ioc.type}: </span>
                        <span className="text-warning font-mono">{ioc.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-text-muted text-sm">
              Click "Analyze with AI" to get an automated threat analysis, attack chain reconstruction, and remediation recommendations.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {alert.status === 'open' && (
            <button
              onClick={handleAcknowledge}
              disabled={acknowledgeAlert.isPending}
              className="btn-primary flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Acknowledge
            </button>
          )}
          <button
            onClick={handleCreateIncident}
            disabled={createIncident.isPending}
            className="btn-secondary flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Create Incident
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <User className="w-4 h-4" />
            Assign
          </button>
          {alert.status !== 'false_positive' && (
            <button
              onClick={handleFalsePositive}
              disabled={updateAlert.isPending}
              className="btn-secondary flex items-center gap-2 text-text-muted hover:text-danger"
            >
              <XCircle className="w-4 h-4" />
              False Positive
            </button>
          )}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="w-3.5 h-3.5" />
            Updated {formatRelativeTime(alert.updated_at)}
          </div>
        </div>
      </div>
    </Modal>
  )
}
