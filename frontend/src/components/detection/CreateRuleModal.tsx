import { useState } from 'react'
import { CheckCircle, XCircle, Play } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useUIStore } from '@/store/uiStore'
import { detectionApi } from '@/lib/api'
import type { AlertSeverity, RuleType, DetectionRule } from '@/types'
import { cn } from '@/lib/utils'

interface CreateRuleModalProps {
  open: boolean
  onClose: () => void
  onCreated?: () => void
  editRule?: DetectionRule | null
}

const MITRE_TACTICS = [
  'Initial Access', 'Execution', 'Persistence', 'Privilege Escalation',
  'Defense Evasion', 'Credential Access', 'Discovery', 'Lateral Movement',
  'Collection', 'Exfiltration', 'Command and Control', 'Impact',
]

const SIGMA_TEMPLATE = `title: My Detection Rule
description: Detects suspicious activity
status: experimental
author: Security Team
date: 2024/01/01
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        EventID: 4688
        CommandLine|contains:
            - 'powershell'
            - 'cmd.exe'
    condition: selection
level: medium
tags:
    - attack.execution
    - attack.t1059`

export function CreateRuleModal({ open, onClose, onCreated, editRule }: CreateRuleModalProps) {
  const addNotification = useUIStore((s) => s.addNotification)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ matched: boolean; message: string } | null>(null)
  const [testEventJson, setTestEventJson] = useState('{\n  "EventID": 4688,\n  "CommandLine": "powershell -enc ..."\n}')

  const [form, setForm] = useState({
    name: editRule?.name ?? '',
    description: editRule?.description ?? '',
    rule_type: (editRule?.rule_type ?? 'sigma') as RuleType,
    severity: (editRule?.severity ?? 'medium') as AlertSeverity,
    rule_content: editRule?.rule_content ?? SIGMA_TEMPLATE,
    mitre_tactics: editRule?.mitre_tactics ?? [] as string[],
  })

  const toggleTactic = (tactic: string) => {
    setForm((f) => ({
      ...f,
      mitre_tactics: f.mitre_tactics.includes(tactic)
        ? f.mitre_tactics.filter((t) => t !== tactic)
        : [...f.mitre_tactics, tactic],
    }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      addNotification('Rule name is required', 'error')
      return
    }
    setIsSubmitting(true)
    try {
      if (editRule) {
        await detectionApi.updateRule(editRule.id, form)
        addNotification('Rule updated successfully', 'success')
      } else {
        await detectionApi.createRule(form)
        addNotification('Rule created successfully', 'success')
      }
      onCreated?.()
      onClose()
    } catch {
      addNotification('Failed to save rule', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTest = async () => {
    if (!editRule?.id) {
      addNotification('Save the rule first before testing', 'warning')
      return
    }
    setIsTesting(true)
    setTestResult(null)
    try {
      const event = JSON.parse(testEventJson)
      const result = await detectionApi.testRule(editRule.id, event)
      setTestResult(result)
    } catch (e) {
      if (e instanceof SyntaxError) {
        addNotification('Invalid JSON in test event', 'error')
      } else {
        addNotification('Rule test failed', 'error')
      }
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editRule ? 'Edit Detection Rule' : 'Create Detection Rule'}
      size="xl"
    >
      <div className="space-y-5">
        {/* Name & Description */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Rule Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Suspicious PowerShell Execution"
              className="input-dark w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Type
              </label>
              <select
                value={form.rule_type}
                onChange={(e) => setForm((f) => ({ ...f, rule_type: e.target.value as RuleType }))}
                className="input-dark w-full"
              >
                <option value="sigma">Sigma</option>
                <option value="threshold">Threshold</option>
                <option value="ml">ML</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Severity
              </label>
              <select
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as AlertSeverity }))}
                className="input-dark w-full"
              >
                {['critical', 'high', 'medium', 'low', 'info'].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
            Description
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Detects suspicious PowerShell commands commonly used in attacks"
            className="input-dark w-full"
          />
        </div>

        {/* Rule Content */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
            {form.rule_type === 'sigma' ? 'Sigma YAML' : 'Rule Content'}
          </label>
          <textarea
            value={form.rule_content}
            onChange={(e) => setForm((f) => ({ ...f, rule_content: e.target.value }))}
            rows={10}
            className="input-dark w-full font-mono text-xs resize-y"
            placeholder={form.rule_type === 'sigma' ? SIGMA_TEMPLATE : 'Enter rule content...'}
            spellCheck={false}
          />
        </div>

        {/* MITRE Tactics */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
            MITRE ATT&CK Tactics
          </label>
          <div className="flex flex-wrap gap-2">
            {MITRE_TACTICS.map((tactic) => {
              const selected = form.mitre_tactics.includes(tactic)
              return (
                <button
                  key={tactic}
                  onClick={() => toggleTactic(tactic)}
                  className={cn(
                    'text-xs px-2 py-1 rounded border transition-colors',
                    selected
                      ? 'bg-accent/20 text-accent border-accent/40'
                      : 'bg-surface-elevated text-text-muted border-border hover:border-accent/40 hover:text-text-secondary',
                  )}
                >
                  {tactic}
                </button>
              )
            })}
          </div>
        </div>

        {/* Test Section */}
        {editRule && (
          <div className="border border-border rounded-lg p-4 bg-surface-elevated">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-text-primary">Test Rule</span>
              <button
                onClick={handleTest}
                disabled={isTesting}
                className="btn-secondary flex items-center gap-2 text-xs py-1.5"
              >
                {isTesting ? <LoadingSpinner size="sm" /> : <Play className="w-3.5 h-3.5" />}
                Test Rule
              </button>
            </div>
            <textarea
              value={testEventJson}
              onChange={(e) => setTestEventJson(e.target.value)}
              rows={4}
              className="input-dark w-full font-mono text-xs resize-none"
              placeholder="Paste a sample event JSON to test against this rule..."
              spellCheck={false}
            />
            {testResult && (
              <div className={cn(
                'mt-3 flex items-center gap-2 text-sm p-2 rounded border',
                testResult.matched
                  ? 'bg-green-900/30 text-green-300 border-green-700/40'
                  : 'bg-red-900/30 text-red-300 border-red-700/40',
              )}>
                {testResult.matched ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{testResult.matched ? 'Rule MATCHED' : 'Rule did not match'}: {testResult.message}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            {isSubmitting && <LoadingSpinner size="sm" />}
            {editRule ? 'Update Rule' : 'Create Rule'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
