// ─── User & Auth ───────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'analyst' | 'viewer'
  org_id: string
  avatar?: string
  created_at: string
  last_login?: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  plan: 'free' | 'pro' | 'enterprise'
  timezone: string
  created_at: string
}

export interface AuthResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  user: User
}

export interface RegisterRequest {
  organization_name: string
  organization_slug: string
  full_name: string
  username: string
  email: string
  password: string
}

// ─── Alerts ────────────────────────────────────────────────────────────────────

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type AlertStatus = 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive'

export interface Alert {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  status: AlertStatus
  source: string
  source_ip?: string
  dest_ip?: string
  dedup_hash: string
  mitre_tactics: string[]
  mitre_techniques: string[]
  raw_event?: Record<string, unknown>
  rule_id?: string
  rule_name?: string
  assigned_to?: string
  assigned_to_name?: string
  incident_id?: string
  org_id: string
  created_at: string
  updated_at: string
  acknowledged_at?: string
  acknowledged_by?: string
  resolved_at?: string
  count: number
  first_seen: string
  last_seen: string
  tags: string[]
  enrichment?: Record<string, unknown>
}

export interface AlertFilters {
  severity?: AlertSeverity[]
  status?: AlertStatus[]
  start_date?: string
  end_date?: string
  search?: string
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface AlertStats {
  total: number
  critical: number
  high: number
  medium: number
  low: number
  info: number
  open: number
  acknowledged: number
  resolved: number
  false_positive: number
  trend_24h: number
}

// ─── Incidents ─────────────────────────────────────────────────────────────────

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low'
export type IncidentStatus = 'open' | 'investigating' | 'contained' | 'resolved' | 'closed'

export interface Incident {
  id: string
  title: string
  description: string
  severity: IncidentSeverity
  status: IncidentStatus
  assigned_to?: string
  assigned_to_name?: string
  alert_ids: string[]
  alert_count: number
  org_id: string
  created_at: string
  updated_at: string
  resolved_at?: string
  tags: string[]
  mitre_tactics: string[]
}

export interface IncidentTimeline {
  id: string
  incident_id: string
  event_type: 'status_change' | 'note' | 'action' | 'escalation' | 'artifact_added' | 'alert_linked'
  content: string
  created_by: string
  created_at: string
}

export interface IncidentFilters {
  status?: IncidentStatus[]
  severity?: IncidentSeverity[]
  assigned_to?: string
  page?: number
  page_size?: number
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string
  org_id?: string
  user_id?: string
  action: string
  resource_type?: string
  resource_id?: string
  changes: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  request_id?: string
  status: 'success' | 'failure' | 'error' | string
  created_at: string
}

export interface AuditLogFilters {
  action?: string
  resource_type?: string
  resource_id?: string
  user_id?: string
  status?: string
  start_time?: string
  end_time?: string
  page?: number
  page_size?: number
}

// ─── Detection Rules ────────────────────────────────────────────────────────────

export type RuleType = 'sigma' | 'threshold' | 'ml' | 'custom'
export type RuleStatus = 'enabled' | 'disabled' | 'testing'

export interface DetectionRule {
  id: string
  name: string
  description: string
  rule_type: RuleType
  severity: AlertSeverity
  status: RuleStatus
  rule_content: string
  mitre_tactics: string[]
  mitre_techniques: string[]
  tags: string[]
  org_id: string
  created_by: string
  created_at: string
  updated_at: string
  last_triggered?: string
  trigger_count: number
  false_positive_rate?: number
}

export interface RuleFilters {
  rule_type?: RuleType[]
  severity?: AlertSeverity[]
  status?: RuleStatus
  search?: string
  page?: number
  page_size?: number
}

export interface RuleTestResult {
  matched: boolean
  rule_id: string
  message: string
  details?: Record<string, unknown>
}

// ─── Assets ────────────────────────────────────────────────────────────────────

export type AssetType = 'server' | 'workstation' | 'network' | 'cloud' | 'container' | 'other'
export type AssetCriticality = 'critical' | 'high' | 'medium' | 'low'

export interface Asset {
  id: string
  hostname: string
  ip_addresses: string[]
  mac_addresses?: string[]
  os?: string
  os_version?: string
  asset_type: AssetType
  criticality: AssetCriticality
  owner?: string
  location?: string
  tags: string[]
  risk_score: number
  open_alerts: number
  last_seen: string
  first_seen: string
  agent_id?: string
  org_id: string
  created_at: string
  updated_at: string
  metadata?: Record<string, unknown>
}

export interface AssetFilters {
  asset_type?: AssetType[]
  criticality?: AssetCriticality[]
  search?: string
  page?: number
  page_size?: number
}

export interface AssetRisk {
  asset_id: string
  risk_score: number
  risk_factors: Array<{
    factor: string
    score: number
    description: string
  }>
  open_alerts: number
  recent_incidents: number
  vulnerability_count: number
  last_calculated: string
}

// ─── Agents ────────────────────────────────────────────────────────────────────

export type AgentStatus = 'online' | 'offline' | 'degraded' | 'unknown'

export interface Agent {
  id: string
  name: string
  description?: string
  hostname: string
  ip_address?: string
  status: AgentStatus
  version?: string
  os?: string
  last_heartbeat?: string
  events_per_second?: number
  events_today?: number
  org_id: string
  created_at: string
  updated_at: string
  api_key_preview?: string
  metadata?: Record<string, unknown>
}

export interface AgentRegistration {
  name: string
  description?: string
  hostname: string
}

export interface AgentRegistrationResponse {
  agent: Agent
  api_key: string
}

// ─── Search / Events ───────────────────────────────────────────────────────────

export interface SearchQuery {
  query: string
  start_time?: string
  end_time?: string
  limit?: number
  offset?: number
  fields?: string[]
}

export interface SearchEvent {
  id: string
  timestamp: string
  source: string
  source_ip?: string
  dest_ip?: string
  event_type: string
  message: string
  severity?: string
  raw: Record<string, unknown>
  tags?: string[]
}

export interface SearchResult {
  total: number
  events: SearchEvent[]
  took_ms: number
  fields: string[]
  timeline?: TimelinePoint[]
}

export interface TimelinePoint {
  timestamp: string
  count: number
}

export interface FieldInfo {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'ip'
  count: number
  top_values?: Array<{ value: string; count: number }>
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  events_today: number
  events_yesterday: number
  active_alerts: number
  critical_alerts: number
  open_incidents: number
  assets_at_risk: number
  total_assets: number
  rules_enabled: number
  agents_online: number
  agents_total: number
  mttr_hours?: number
  trend: {
    events: number
    alerts: number
    incidents: number
  }
}

export interface AlertsTimeline {
  points: TimelinePoint[]
  by_severity?: Record<AlertSeverity, TimelinePoint[]>
}

export interface MitreHeatmap {
  tactics: Array<{
    id: string
    name: string
    count: number
    techniques: Array<{
      id: string
      name: string
      count: number
    }>
  }>
}

// ─── AI ────────────────────────────────────────────────────────────────────────

export interface AIAnalysisResponse {
  alert_id: string
  summary: string
  attack_chain: Array<{
    step: number
    description: string
    tactic?: string
    technique?: string
  }>
  recommendations: string[]
  risk_score: number
  confidence: number
  related_alerts?: string[]
  iocs?: Array<{
    type: string
    value: string
    description?: string
  }>
  generated_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

export interface ChatResponse {
  message: ChatMessage
  context_used?: string[]
}

export interface AIStatus {
  provider: string
  model: string
  available: boolean
  latency_ms?: number
  checked_at: string
}

export interface SuggestQueryResponse {
  query: string
  explanation: string
  alternatives?: string[]
}

// ─── Pagination ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// ─── Notification ──────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timestamp: string
}
