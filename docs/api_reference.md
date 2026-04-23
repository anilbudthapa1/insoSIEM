# API Reference

## Authentication

- `POST /api/v1/auth/register`: Create a new tenant workspace and first administrator.
- `POST /api/v1/auth/login`: Login with email and password.
- `POST /api/v1/auth/refresh`: Rotate refresh token and issue a new access token.
- `POST /api/v1/auth/logout`: Revoke current session tokens.
- `POST /api/v1/auth/mfa/setup`: Start TOTP MFA setup.
- `POST /api/v1/auth/mfa/verify`: Verify MFA code and issue tokens.
- `POST /api/v1/auth/password-reset/request`: Request password reset instructions without revealing account existence.
- `POST /api/v1/auth/password-reset/confirm`: Confirm a password reset token, update password hash, and revoke refresh sessions.

## Ingestion

- `POST /api/v1/ingest/events`: Ingest a single raw event.
- `POST /api/v1/ingest/rest`: Ingest a single raw event through the REST-specific alias.
- `POST /api/v1/ingest/bulk`: Ingest a bounded batch of raw events.
- `POST /api/v1/ingest/batch-upload`: Ingest line-oriented raw, JSON, or NDJSON upload batches.
- `POST /api/v1/ingest/webhook/{source}`: Ingest an authenticated generic webhook payload.
- `POST /api/v1/ingest/otel`: Ingest OpenTelemetry JSON log records.
- `GET /api/v1/ingest/health`: Return ingestion capability and health summary for the current tenant.
- `GET /api/v1/ingest/capabilities`: Return supported inputs, parsers, auth methods, queue subjects, and reliability controls.
- `GET /api/v1/ingest/auth/status`: Validate JWT or agent API key ingestion identity.
- `GET /api/v1/ingest/queue`: Return raw-event and dead-letter queue status.
- `GET /api/v1/ingest/dead-letter`: Return dead-letter workflow status.
- `POST /api/v1/ingest/malformed`: Record malformed events for dead-letter repair workflows.
- `POST /api/v1/ingest/deduplicate/check`: Check and register tenant-scoped duplicate event keys.
- `GET /api/v1/ingest/rate-limits`: Return ingestion rate-limit policy.
- `GET /api/v1/ingest/grpc/status`: Return gRPC ingestion adapter readiness.
- `GET /api/v1/ingest/syslog/tls/status`: Return syslog TLS receiver readiness.
- `GET /api/v1/ingest/kafka/status`: Return Kafka ingestion readiness.

## Parsing and Normalization

- `GET /api/v1/parsing/capabilities`: Return parser, pipeline, mapping, enrichment, and quality-check capabilities.
- `GET /api/v1/parsing/parsers`: List parser catalog entries.
- `GET /api/v1/parsing/mappings`: List schema mapping profiles.
- `POST /api/v1/parsing/test`: Test a selected or automatic parser against one raw message.
- `POST /api/v1/parsing/pipeline/run`: Run parse and normalization for one sample event.
- `POST /api/v1/parsing/normalize`: Normalize already parsed fields.
- `GET /api/v1/parsing/failures`: Return parser failure monitoring controls.

## Search

- `POST /api/v1/search/events`: Search events using InsoQL.
- `GET /api/v1/search/capabilities`: Return the search capability matrix.
- `POST /api/v1/search/query/parse`: Parse InsoQL into field filters and free text.
- `POST /api/v1/search/query/translate`: Translate simple SPL, KQL, SQL WHERE, or natural-language drafts to InsoQL.
- `POST /api/v1/search/ai/generate`: Generate a safe deterministic query draft from analyst intent.
- `POST /api/v1/search/ai/explain`: Explain a query in terms of field filters and free text.
- `GET /api/v1/search/saved`, `POST /api/v1/search/saved`: List or create tenant-scoped saved search drafts.
- `GET /api/v1/search/scheduled`, `POST /api/v1/search/scheduled`: List or create tenant-scoped scheduled search drafts.
- `GET /api/v1/search/history`: Return recent tenant search history.
- `GET /api/v1/search/templates`: Return built-in SOC query templates.
- `GET /api/v1/search/timeline`: Return event counts over time.
- `GET /api/v1/search/fields`: Return observed fields from recent events.
- `GET /api/v1/search/performance`: Return search performance monitoring baseline.
- `GET /api/v1/search/permissions`: Return tenant and cross-tenant search permission state.
- `GET /api/v1/search/federated/status`: Return federated-search readiness.
- `GET /api/v1/search/archive/status`: Return long-term archive-search readiness.
- `POST /api/v1/search/export/json`: Export search results as JSON.
- `POST /api/v1/search/export/csv`: Export search results as CSV.
- `POST /api/v1/search/export/pdf`: Export search results as a compact PDF evidence report.

## Enrichment

- `GET /api/v1/enrichment/capabilities`: Return enrichment context capabilities.
- `POST /api/v1/enrichment/identity/lookup`: Build identity context and risk flags.
- `POST /api/v1/enrichment/asn/lookup`: Build ASN/IP ownership context.
- `POST /api/v1/enrichment/dns/reverse`: Resolve reverse DNS context.
- `POST /api/v1/enrichment/threat-intel/lookup`: Score an indicator with local heuristics.
- `POST /api/v1/enrichment/vulnerabilities/context`: Build CVE/software risk context.
- `POST /api/v1/enrichment/cloud/context`: Normalize cloud account/resource metadata.
- `POST /api/v1/enrichment/mitre/context`: Build MITRE ATT&CK context.
- `POST /api/v1/enrichment/kill-chain/context`: Build kill-chain phase context.

## Storage

- `GET /api/v1/storage/capabilities`: Return storage/indexing module capabilities.
- `GET /api/v1/storage/tiers`: List hot, warm, cold, and archive tier profiles.
- `PUT /api/v1/storage/tiering-policy`: Validate tier transition policy.
- `GET /api/v1/storage/retention-policy`, `PUT /api/v1/storage/retention-policy`: Read or validate retention and immutability policy.
- `GET /api/v1/storage/indexing`, `PUT /api/v1/storage/indexing`: Read or validate indexing policy.
- `GET /api/v1/storage/usage`: Return storage usage monitoring baseline.
- `GET /api/v1/storage/optimization`: Return volume optimization controls.
- `PUT /api/v1/storage/sampling-policy`: Validate data sampling policy.
- `PUT /api/v1/storage/pre-ingestion-filter`: Validate pre-ingestion filtering policy.
- `GET /api/v1/storage/cost-control`: Return storage cost-control guardrails.
- `GET /api/v1/storage/backup/status`: Return backup and restore readiness.
- `POST /api/v1/storage/backup/restore/preview`: Preview backup restore workflow.

## SOC Operations

- `GET /api/v1/alerts`: List tenant-scoped alerts.
- `GET /api/v1/alerts/capabilities`: Return alerting capability matrix.
- `POST /api/v1/alerts/generate/preview`: Preview candidate alert generation.
- `GET /api/v1/alerts/severity/model`: Return severity rank model.
- `POST /api/v1/alerts/risk/score`: Score alert risk.
- `GET /api/v1/alerts/risk-based/policy`: Return risk-based routing thresholds.
- `POST /api/v1/alerts/deduplication/preview`: Preview stable deduplication key.
- `POST /api/v1/alerts/grouping/preview`: Preview alert grouping.
- `GET /api/v1/alerts/suppression/policies`, `POST /api/v1/alerts/suppression/policies`: List or create suppression policy drafts.
- `GET /api/v1/alerts/escalation/policies`, `POST /api/v1/alerts/escalation/policies`: List or create escalation policy drafts.
- `POST /api/v1/alerts/notifications/preview`: Preview notification payload.
- `GET /api/v1/alerts/tuning/recommendations`: Return alert tuning recommendations.
- `GET /api/v1/alerts/noise-reduction/summary`: Return noise-reduction controls.
- `GET /api/v1/alerts/priority-queue`: Return priority queue sort policy.
- `GET /api/v1/alerts/review-queue`: Return review queue policy.
- `GET /api/v1/alerts/{alert_id}`: Read one tenant-scoped alert.
- `PATCH /api/v1/alerts/{alert_id}`: Update alert status, assignment, or description.
- `POST /api/v1/alerts/{alert_id}/acknowledge`: Acknowledge one alert.
- `GET /api/v1/alerts/{alert_id}/comments`, `POST /api/v1/alerts/{alert_id}/comments`: List or add alert comments.
- `GET /api/v1/alerts/{alert_id}/sla`: Return alert SLA target.
- `GET /api/v1/alerts/{alert_id}/evidence`, `POST /api/v1/alerts/{alert_id}/evidence`: List or add alert evidence references.
- `GET /api/v1/alerts/{alert_id}/timeline`: Return alert timeline entries.
- `GET /api/v1/alerts/{alert_id}/audit-trail`: Return alert workflow audit events and persistence status.
- `POST /api/v1/alerts/{alert_id}/review`: Record alert review decision.
- `GET /api/v1/alerts/stats`: Return alert counts by severity and status.
- `GET /api/v1/incidents/capabilities`: Return incident and case workflow capability matrix.
- `GET /api/v1/incidents/severity/model`: Return incident severity model.
- `GET /api/v1/incidents`: List tenant-scoped incidents with linked-alert counts.
- `POST /api/v1/incidents`: Create an incident. Optional `alert_ids` are linked after tenant validation.
- `GET /api/v1/incidents/{incident_id}`: Read one tenant-scoped incident.
- `PATCH /api/v1/incidents/{incident_id}`: Partially update incident severity, status, assignment, title, or description.
- `PUT /api/v1/incidents/{incident_id}`: Update incident fields for legacy clients.
- `POST /api/v1/incidents/{incident_id}/alerts`: Link an alert to an incident after tenant validation.
- `GET /api/v1/incidents/{incident_id}/timeline`: List incident timeline entries.
- `POST /api/v1/incidents/{incident_id}/timeline`: Add an analyst timeline note, action, escalation, artifact, or status entry.
- `GET /api/v1/incidents/{incident_id}/notes`, `POST /api/v1/incidents/{incident_id}/notes`: List or add analyst notes.
- `GET /api/v1/incidents/{incident_id}/kill-chain-timeline`: Return kill-chain timeline phases.
- `GET /api/v1/incidents/{incident_id}/evidence`, `POST /api/v1/incidents/{incident_id}/evidence`: List or add incident evidence.
- `GET /api/v1/incidents/{incident_id}/chain-of-custody`, `POST /api/v1/incidents/{incident_id}/chain-of-custody`: List or record evidence custody events.
- `GET /api/v1/incidents/{incident_id}/root-cause`, `POST /api/v1/incidents/{incident_id}/root-cause`: Read or record root-cause analysis.
- `GET /api/v1/incidents/{incident_id}/affected-assets`, `POST /api/v1/incidents/{incident_id}/affected-assets`: List or add affected assets.
- `GET /api/v1/incidents/{incident_id}/affected-users`, `POST /api/v1/incidents/{incident_id}/affected-users`: List or add affected users.
- `GET /api/v1/incidents/{incident_id}/iocs`, `POST /api/v1/incidents/{incident_id}/iocs`: List or link IOCs.
- `GET /api/v1/incidents/{incident_id}/collaboration`, `POST /api/v1/incidents/{incident_id}/collaboration`: List or add collaboration messages.
- `GET /api/v1/incidents/{incident_id}/post-incident-review`, `POST /api/v1/incidents/{incident_id}/post-incident-review`: Read or record post-incident review.
- `GET /api/v1/incidents/{incident_id}/report`: Generate structured incident report metadata.
- `GET /api/v1/incidents/{incident_id}/executive-summary`: Generate executive incident summary.
- `POST /api/v1/incidents/{incident_id}/closure`: Close an incident with resolution metadata.
- `GET /api/v1/cases`, `POST /api/v1/cases`, `GET /api/v1/cases/{case_id}`: Case aliases backed by the incident service.
- `GET /api/v1/audit/logs`: List tenant audit entries for admins with action, resource, user, status, and time filters.
- `GET /api/v1/audit/logs/export`: Export up to 5000 filtered tenant audit entries as CSV for admins.
- `GET /api/v1/audit/logs/{audit_id}`: Read one tenant audit entry for admins.
- Detections, assets, agents, RBAC, users, organizations, and platform settings are exposed under `/api/v1/*` route groups.

## AI-Native SOC

- `POST /api/v1/ai/alerts/summarize`: Summarize supplied alert context in deterministic safe mode.
- `POST /api/v1/ai/alerts/triage`: Recommend alert priority, queue, and next steps.
- `POST /api/v1/ai/severity/recommend`: Recommend severity from context drivers.
- `POST /api/v1/ai/false-positive/score`: Score likely false positive conditions.
- `POST /api/v1/ai/investigation/assistant`: Return investigation questions, queries, and containment guidance.
- `POST /api/v1/ai/root-cause`: Draft root-cause hypotheses from supplied context.
- `POST /api/v1/ai/timeline/generate`: Generate ordered timeline entries from events or evidence.
- `POST /api/v1/ai/threat-hunting/assistant`: Build hunt query and pivot-field recommendations.
- `POST /api/v1/ai/detection/rule/generate`: Generate disabled detection-rule drafts for analyst review.
- `POST /api/v1/ai/detection/sigma/generate`: Generate experimental Sigma-like rule drafts.
- `POST /api/v1/ai/query/generate`: Generate a safe non-executing query draft.
- `POST /api/v1/ai/query/optimize`: Return bounded query optimization notes.
- `POST /api/v1/ai/query/explain`: Explain query review posture.
- `POST /api/v1/ai/report/write`: Draft SOC report structure.
- `POST /api/v1/ai/executive-summary`: Generate executive-safe summary text.
- `POST /api/v1/ai/compliance-report`: Draft compliance-report sections.
- `POST /api/v1/ai/playbook/build`: Build disabled playbook drafts.
- `POST /api/v1/ai/runbook/assist`: Return runbook execution guidance.
- `POST /api/v1/ai/noise-reduction`: Recommend alert-noise reduction controls.
- `POST /api/v1/ai/correlation/recommend`: Recommend correlation keys and time windows.
- `POST /api/v1/ai/evidence/citations`: Generate stable evidence citation IDs.
- `POST /api/v1/ai/hallucination/check`: Check claims against supplied evidence.
- `GET /api/v1/ai/prompt-audit/logs`, `POST /api/v1/ai/prompt-audit/logs`: List or record prompt-audit events.
- `GET /api/v1/ai/guardrails/policy`, `POST /api/v1/ai/guardrails/policy`: Read or update AI guardrail policy.
- `POST /api/v1/ai/privacy/redaction/preview`: Preview PII redaction for AI context.
- `GET /api/v1/ai/models/selection`: Return configured model selection and fallbacks.
- `GET /api/v1/ai/providers/local/status`: Return local LLM status.
- `GET /api/v1/ai/providers/cloud/status`: Return cloud LLM status.
- `POST /api/v1/ai/rag/query`: Query supplied RAG context until vector storage is configured.
- `GET /api/v1/ai/knowledge-base/articles`, `POST /api/v1/ai/knowledge-base/articles`: List or create SOC knowledge-base articles.
- `POST /api/v1/ai/knowledge-base/search`: Search tenant SOC knowledge-base articles.

## Threat Intelligence

- `GET /api/v1/threat-intel/capabilities`: Return threat-intelligence capability matrix.
- `GET /api/v1/threat-intel/feeds`, `POST /api/v1/threat-intel/feeds`: List or create threat-intelligence feed definitions.
- `GET /api/v1/threat-intel/iocs`, `POST /api/v1/threat-intel/iocs`: List or create IOCs with type, confidence, reputation, source, tags, and expiry.
- `POST /api/v1/threat-intel/iocs/match`: Match tenant IOCs against supplied indicators or event fields.
- `GET /api/v1/threat-intel/iocs/expiry`: Return expired and expiring-soon IOC summaries.
- `POST /api/v1/threat-intel/iocs/confidence/score`: Score IOC confidence from reliability, sightings, and analyst input.
- `POST /api/v1/threat-intel/reputation/ip`: Score IP reputation.
- `POST /api/v1/threat-intel/reputation/domain`: Score domain reputation.
- `POST /api/v1/threat-intel/reputation/url`: Score URL reputation.
- `POST /api/v1/threat-intel/reputation/hash`: Score file-hash reputation.
- `POST /api/v1/threat-intel/reputation/email`: Score email IOC reputation.
- `GET /api/v1/threat-intel/integrations/misp/status`: Return MISP integration readiness.
- `GET /api/v1/threat-intel/integrations/virustotal/status`: Return VirusTotal integration readiness.
- `GET /api/v1/threat-intel/integrations/abuseipdb/status`: Return AbuseIPDB integration readiness.
- `GET /api/v1/threat-intel/integrations/otx/status`: Return AlienVault OTX integration readiness.
- `GET /api/v1/threat-intel/integrations/stix-taxii/status`: Return STIX/TAXII integration readiness.
- `POST /api/v1/threat-intel/feeds/deduplicate`: Deduplicate feed items by indicator field.
- `GET /api/v1/threat-intel/actors`, `POST /api/v1/threat-intel/actors`: List or create threat actor profiles.
- `GET /api/v1/threat-intel/malware-families`, `POST /api/v1/threat-intel/malware-families`: List or create malware family mappings.
- `GET /api/v1/threat-intel/campaigns`, `POST /api/v1/threat-intel/campaigns`: List or create campaign mappings.
- `GET /api/v1/threat-intel/dashboard`: Return threat-intelligence dashboard summary.

## SOAR And Automation

- `GET /api/v1/soar/capabilities`: Return SOAR capability matrix.
- `GET /api/v1/soar/playbooks`, `POST /api/v1/soar/playbooks`: List or create SOAR playbooks.
- `POST /api/v1/soar/playbooks/builder/preview`: Preview playbook builder validation.
- `POST /api/v1/soar/playbooks/test`: Run playbook sandbox dry run.
- `POST /api/v1/soar/actions/manual`: Preview manual response action and risk.
- `POST /api/v1/soar/actions/automated`: Preview automated response action in dry-run mode.
- `GET /api/v1/soar/approvals`, `POST /api/v1/soar/approvals`: List or record automation approvals.
- `POST /api/v1/soar/actions/webhook/preview`: Preview webhook action.
- `POST /api/v1/soar/notifications/email/preview`: Preview email notification.
- `POST /api/v1/soar/notifications/slack/preview`: Preview Slack notification.
- `POST /api/v1/soar/notifications/teams/preview`: Preview Microsoft Teams notification.
- `POST /api/v1/soar/tickets/preview`: Preview ticket creation.
- `GET /api/v1/soar/integrations/jira/status`: Return Jira readiness.
- `GET /api/v1/soar/integrations/servicenow/status`: Return ServiceNow readiness.
- `POST /api/v1/soar/exports/firewall-blocklist`: Export deduplicated firewall blocklist indicators.
- `GET /api/v1/soar/integrations/edr/status`: Return EDR response readiness.
- `POST /api/v1/soar/actions/endpoint-isolation/preview`: Preview endpoint isolation.
- `POST /api/v1/soar/actions/user-disable/preview`: Preview user disable action.
- `POST /api/v1/soar/actions/password-reset/preview`: Preview password reset action.
- `POST /api/v1/soar/actions/ip-block/preview`: Preview IP block action.
- `POST /api/v1/soar/actions/domain-block/preview`: Preview domain block action.
- `POST /api/v1/soar/actions/host-quarantine/preview`: Preview host quarantine action.
- `GET /api/v1/soar/audit-log`: List automation audit events.
- `GET /api/v1/soar/safety-controls`, `POST /api/v1/soar/safety-controls`: Read or update automation safety controls.
- `GET /api/v1/soar/rate-limits`, `POST /api/v1/soar/rate-limits`: Read or update automation rate limits.
- `POST /api/v1/soar/rollback/preview`: Preview rollback action.

## Assets And Attack Surface

- `GET /api/v1/assets`, `POST /api/v1/assets`: List or create tenant assets.
- `GET /api/v1/assets/{asset_id}`, `PUT /api/v1/assets/{asset_id}`, `DELETE /api/v1/assets/{asset_id}`: Read, update, or delete an asset.
- `GET /api/v1/assets/{asset_id}/risk`: Return asset risk summary.
- `GET /api/v1/assets/capabilities`: Return asset inventory and discovery capability matrix.
- `GET /api/v1/assets/inventory/summary`: Return asset inventory counts by type and criticality.
- `GET /api/v1/assets/risk/model`: Return asset risk scoring model.
- `POST /api/v1/assets/risk/score`: Score asset risk from criticality, exposure, vulnerabilities, alerts, and internet-facing state.
- `GET /api/v1/assets/ownership/policy`, `PUT /api/v1/assets/ownership/policy`: Read or update asset ownership policy.
- `POST /api/v1/assets/tagging/preview`: Preview normalized asset tags.
- `GET /api/v1/assets/criticality/model`: Return asset criticality scoring model.
- `POST /api/v1/assets/criticality/score`: Score asset criticality from business and exposure context.
- `POST /api/v1/assets/discovery/preview`: Preview asset discovery.
- `POST /api/v1/assets/discovery/cloud`: Preview cloud asset discovery.
- `POST /api/v1/assets/discovery/attack-surface`: Preview attack-surface discovery.

## Identity And UEBA

- `GET /api/v1/identity/capabilities`: Return identity and UEBA capability matrix.
- `GET /api/v1/identity/users/inventory`: Return user inventory summary.
- `GET /api/v1/identity/inventory`, `POST /api/v1/identity/inventory`: List or create identity inventory records.
- `GET /api/v1/identity/integrations/active-directory/status`: Return Active Directory readiness.
- `GET /api/v1/identity/integrations/ldap/status`: Return LDAP readiness.
- `GET /api/v1/identity/integrations/entra/status`: Return Azure AD / Entra ID readiness.
- `GET /api/v1/identity/integrations/okta/status`: Return Okta readiness.
- `GET /api/v1/identity/integrations/cloud/status`: Return cloud identity readiness.
- `POST /api/v1/identity/privileged-accounts/monitor`: Analyze privileged account activity.
- `POST /api/v1/identity/service-accounts/monitor`: Analyze service account activity.
- `POST /api/v1/identity/iam-risk/score`: Score IAM risk.
- `POST /api/v1/identity/ueba/user-behavior`: Analyze user behavior events.
- `POST /api/v1/identity/ueba/entity-behavior`: Analyze entity behavior events.
- `POST /api/v1/identity/ueba/baseline`: Learn UEBA baseline metadata.
- `POST /api/v1/identity/ueba/peer-groups`: Analyze peer groups.
- `POST /api/v1/identity/detections/impossible-travel`: Detect impossible travel.
- `POST /api/v1/identity/detections/mfa-fatigue`: Detect MFA fatigue.
- `POST /api/v1/identity/detections/password-spraying`: Detect password spraying.

## Security Analytics

- `GET /api/v1/security-analytics/capabilities`: Return security analytics pack matrix.
- `POST /api/v1/security-analytics/authentication`: Analyze authentication events.
- `POST /api/v1/security-analytics/powershell`: Analyze PowerShell events.
- `POST /api/v1/security-analytics/process-tree`: Analyze process trees.
- `POST /api/v1/security-analytics/file-integrity`: Analyze file integrity events.
- `POST /api/v1/security-analytics/registry`: Analyze registry events.
- `POST /api/v1/security-analytics/usb`: Analyze USB device events.
- `POST /api/v1/security-analytics/remote-access`: Analyze remote access events.
- `POST /api/v1/security-analytics/vpn`: Analyze VPN events.
- `POST /api/v1/security-analytics/dns-query`: Analyze DNS query events.
- `POST /api/v1/security-analytics/network-flow`: Analyze network flows.
- `POST /api/v1/security-analytics/packet-metadata`: Analyze packet metadata.
- `POST /api/v1/security-analytics/waf`: Analyze WAF logs.
- `POST /api/v1/security-analytics/web-attack`: Analyze web attack signals.
- `POST /api/v1/security-analytics/database-attack`: Analyze database attack signals.
- `POST /api/v1/security-analytics/cloud-misconfiguration`: Analyze cloud misconfiguration signals.
- `POST /api/v1/security-analytics/lateral-movement`: Detect lateral movement signals.
- `POST /api/v1/security-analytics/privilege-escalation`: Detect privilege escalation signals.
- `POST /api/v1/security-analytics/data-exfiltration`: Detect data exfiltration signals.
- `POST /api/v1/security-analytics/ransomware`: Detect ransomware behavior.
- `POST /api/v1/security-analytics/command-control`: Detect command and control signals.
- `POST /api/v1/security-analytics/insider-threat`: Detect insider threat signals.
- `POST /api/v1/security-analytics/malware-behavior`: Detect malware behavior.
- `POST /api/v1/security-analytics/credential-theft`: Detect credential theft.
- `POST /api/v1/security-analytics/persistence`: Detect persistence behavior.
- `POST /api/v1/security-analytics/defense-evasion`: Detect defense evasion.
- `POST /api/v1/security-analytics/cloud/aws`: Analyze AWS security signals.
- `POST /api/v1/security-analytics/cloud/azure`: Analyze Azure security signals.
- `POST /api/v1/security-analytics/cloud/gcp`: Analyze Google Cloud security signals.
- `POST /api/v1/security-analytics/cloudtrail`: Analyze CloudTrail events.

## Cloud Security And DevSecOps

- `GET /api/v1/cloud-security/capabilities`: Return cloud, container, and DevSecOps capability matrix.
- `POST /api/v1/cloud-security/azure-activity/analyze`: Analyze Azure Activity Log signals.
- `POST /api/v1/cloud-security/gcp-audit/analyze`: Analyze Google Cloud audit log signals.
- `POST /api/v1/cloud-security/iam/monitor`: Monitor cloud IAM risk signals.
- `POST /api/v1/cloud-security/storage/monitor`: Monitor cloud storage exposure signals.
- `POST /api/v1/cloud-security/network/monitor`: Monitor cloud network exposure signals.
- `POST /api/v1/cloud-security/workloads/monitor`: Monitor cloud workload risk signals.
- `POST /api/v1/cloud-security/containers/runtime/analyze`: Analyze container runtime risk signals.
- `POST /api/v1/cloud-security/kubernetes/security/analyze`: Analyze Kubernetes security posture signals.
- `POST /api/v1/cloud-security/kubernetes/audit/analyze`: Analyze Kubernetes audit log signals.
- `POST /api/v1/cloud-security/kubernetes/rbac/monitor`: Score Kubernetes RBAC binding risk.
- `POST /api/v1/cloud-security/docker/security/analyze`: Analyze Docker security signals.
- `POST /api/v1/cloud-security/cicd/logs/monitor`: Monitor CI/CD security log signals.
- `GET /api/v1/cloud-security/integrations/github/status`: Return GitHub security integration readiness.
- `GET /api/v1/cloud-security/integrations/gitlab/status`: Return GitLab security integration readiness.
- `POST /api/v1/cloud-security/secrets/detect`: Detect and fingerprint redacted secrets in supplied artifacts.
- `GET /api/v1/cloud-security/devsecops/dashboard`: Return DevSecOps dashboard widget readiness.

## Vulnerability And Exposure

- `GET /api/v1/vulnerabilities/capabilities`: Return vulnerability and exposure capability matrix.
- `GET /api/v1/vulnerabilities/scanners/status`: Return scanner integration readiness.
- `GET /api/v1/vulnerabilities/integrations/nessus/status`: Return Nessus integration readiness.
- `GET /api/v1/vulnerabilities/integrations/openvas/status`: Return OpenVAS integration readiness.
- `GET /api/v1/vulnerabilities/integrations/qualys/status`: Return Qualys integration readiness.
- `POST /api/v1/vulnerabilities/context`: Build vulnerability context and risk score.
- `POST /api/v1/vulnerabilities/cves/map`: Normalize scanner findings into CVE mappings.
- `POST /api/v1/vulnerabilities/exploitability/score`: Score exploitability from CVSS, EPSS, exploit availability, and exposure.
- `POST /api/v1/vulnerabilities/epss/score`: Normalize EPSS into percent and priority.
- `POST /api/v1/vulnerabilities/assets/risk`: Score asset vulnerability risk.
- `POST /api/v1/vulnerabilities/patch/status`: Summarize patch status and stale assets.
- `POST /api/v1/vulnerabilities/exposure/dashboard`: Return exposure dashboard scoring and widgets.
- `POST /api/v1/vulnerabilities/attack-path/visualize`: Build attack-path graph summary.
- `POST /api/v1/vulnerabilities/entity-graph`: Build entity relationship graph summary.
- `POST /api/v1/vulnerabilities/investigation-graph`: Build investigation graph summary.
- `POST /api/v1/vulnerabilities/attack-surface/risk`: Score attack-surface risk.

## Compliance And Governance

- `GET /api/v1/compliance/capabilities`: Return compliance and governance capability matrix.
- `GET /api/v1/compliance/dashboard`: Return compliance dashboard readiness.
- `GET /api/v1/compliance/frameworks/{framework}/map`: Return framework controls and evidence types for ISO 27001, NIST CSF, NIST 800-53, PCI DSS, SOC 2, HIPAA, GDPR, and Essential Eight.
- `POST /api/v1/compliance/audit-report`: Generate audit report metadata.
- `POST /api/v1/compliance/control-evidence`: Record control evidence metadata.
- `GET /api/v1/compliance/policies`, `POST /api/v1/compliance/policies`: List or create policy metadata.
- `POST /api/v1/compliance/risk-register`: Create scored risk register metadata.
- `POST /api/v1/compliance/gap-analysis`: Analyze compliance coverage and gaps.
- `POST /api/v1/compliance/reports/schedule`: Schedule compliance report metadata.
- `POST /api/v1/compliance/report-templates/build`: Build report template sections.
- `GET /api/v1/compliance/executive-dashboard`: Return executive compliance dashboard readiness.
- `POST /api/v1/compliance/board-report`: Generate board-level report metadata.
- `GET /api/v1/compliance/data-residency`, `PUT /api/v1/compliance/data-residency`: Read or update data residency policy.
- `GET /api/v1/compliance/privacy`, `PUT /api/v1/compliance/privacy`: Read or update privacy management policy.
- `POST /api/v1/compliance/privacy/redaction/preview`: Preview privacy redaction policy.

## SOC Metrics And Workspaces

- `GET /api/v1/soc-operations/capabilities`: Return SOC operations capability matrix.
- `GET /api/v1/soc-operations/overview`: Return SOC overview dashboard readiness.
- `POST /api/v1/soc-operations/dashboards/builder/preview`: Preview custom dashboard metadata.
- `GET /api/v1/soc-operations/widgets`, `POST /api/v1/soc-operations/widgets`: List or create widget metadata.
- `POST /api/v1/soc-operations/dashboards/share`: Preview dashboard sharing.
- `POST /api/v1/soc-operations/analyst-workload`: Summarize analyst case workload.
- `POST /api/v1/soc-operations/metrics/summary`: Summarize alert, case, MTTD, and MTTR metrics.
- `POST /api/v1/soc-operations/kpi/dashboard`: Return KPI dashboard metrics.
- `POST /api/v1/soc-operations/metrics/mttd`: Calculate mean time to detect.
- `POST /api/v1/soc-operations/metrics/mttr`: Calculate mean time to respond.
- `POST /api/v1/soc-operations/sla/breaches`: Count SLA breaches.
- `POST /api/v1/soc-operations/case-backlog`: Summarize case backlog.
- `POST /api/v1/soc-operations/alert-volume`: Analyze alert volume.
- `POST /api/v1/soc-operations/detection-quality`: Analyze detection quality.
- `POST /api/v1/soc-operations/false-positive-rate`: Calculate false-positive rate.
- `GET /api/v1/soc-operations/shift-handover`, `POST /api/v1/soc-operations/shift-handover`: List or create shift handovers.
- `GET /api/v1/soc-operations/hunting-notebooks`, `POST /api/v1/soc-operations/hunting-notebooks`: List or create hunting notebooks.
- `POST /api/v1/soc-operations/threat-hunting/workspace`: Build threat-hunting workspace metadata.
- `GET /api/v1/soc-operations/runbooks`, `POST /api/v1/soc-operations/runbooks`: List or create runbook metadata.
- `GET /api/v1/soc-operations/knowledge-base`, `POST /api/v1/soc-operations/knowledge-base`: List or create SOC knowledge-base articles.
- `POST /api/v1/soc-operations/analyst-activity/audit`: Summarize analyst activity audit metadata.

## Simulation And Validation

- `GET /api/v1/validation/capabilities`: Return simulation and validation capability matrix.
- `POST /api/v1/validation/purple-team/simulate`: Preview purple-team simulation.
- `POST /api/v1/validation/attacks/simulate`: Preview attack simulation.
- `POST /api/v1/validation/breach-attack/simulate`: Preview breach-and-attack simulation.
- `GET /api/v1/validation/integrations/mitre-caldera/status`: Return MITRE Caldera readiness.
- `GET /api/v1/validation/integrations/atomic-red-team/status`: Return Atomic Red Team readiness.
- `POST /api/v1/validation/detections/validate`: Validate detection coverage against events.
- `POST /api/v1/validation/controls/validate`: Validate security controls.
- `POST /api/v1/validation/sample-log-replay`: Preview sample log replay.
- `GET /api/v1/validation/lab-scenarios`: List lab scenarios.
- `GET /api/v1/validation/phishing-simulation/status`: Return phishing simulation readiness.
- `GET /api/v1/validation/mail-security-simulation/status`: Return mail security simulation readiness.
- `POST /api/v1/validation/red-team/evidence/import`: Import red-team evidence metadata.
- `POST /api/v1/validation/detection-coverage/test`: Test detection coverage.
- `POST /api/v1/validation/rules/regression-test`: Preview rule regression testing.
- `POST /api/v1/validation/security-content/test`: Preview security content testing.

## System Administration

- `GET /api/v1/system-admin/capabilities`: Return system administration capability matrix.
- `GET /api/v1/system-admin/health`: Return system health status.
- `POST /api/v1/system-admin/cluster/health`: Summarize cluster health from supplied nodes.
- `POST /api/v1/system-admin/nodes`: Summarize node metadata.
- `POST /api/v1/system-admin/high-availability`: Check HA readiness.
- `POST /api/v1/system-admin/scaling/horizontal`: Check horizontal scaling readiness.
- `GET /api/v1/system-admin/load-balancer`: Return load-balancer readiness.
- `GET /api/v1/system-admin/disaster-recovery/status`: Return disaster recovery metadata.
- `GET /api/v1/system-admin/configuration`, `POST /api/v1/system-admin/configuration`: Read or validate safe configuration metadata.
- `GET /api/v1/system-admin/environment/setup`: Return environment setup checklist.
- `GET /api/v1/system-admin/deployments/docker`: Return Docker deployment readiness.
- `GET /api/v1/system-admin/deployments/kubernetes`: Return Kubernetes deployment readiness.
- `GET /api/v1/system-admin/deployments/helm`: Return Helm chart readiness.
- `POST /api/v1/system-admin/upgrades/plan`: Build update or upgrade plan metadata.
- `GET /api/v1/system-admin/migrations/status`: Return migration status.
- `GET /api/v1/system-admin/backup/verification`: Return backup verification status.
- `POST /api/v1/system-admin/certificates`: Validate certificate metadata.
- `POST /api/v1/system-admin/secrets`: Register secret metadata without returning secret values.
- `POST /api/v1/system-admin/encryption-keys`: Register encryption key metadata without returning key material.
- `POST /api/v1/system-admin/api-tokens`: Register API token metadata without returning token values.
- `POST /api/v1/system-admin/integration-secrets-vault`: Register integration secret metadata without returning secret values.

## Developer Ecosystem

- `GET /api/v1/developer/capabilities`: Return API, plugin, and developer ecosystem capability matrix.
- `GET /api/v1/developer/api-gateway/status`: Return API gateway status.
- `GET /api/v1/developer/public-rest-api`: Return public REST API metadata.
- `GET /api/v1/developer/graphql/status`: Return GraphQL API status.
- `POST /api/v1/developer/webhook-security/validate`: Validate webhook HMAC signature metadata.
- `GET /api/v1/developer/plugins`, `POST /api/v1/developer/plugins`: List or register plugin metadata.
- `GET /api/v1/developer/plugin-marketplace`: Return plugin marketplace catalog metadata.
- `GET /api/v1/developer/connectors`, `POST /api/v1/developer/connectors`: List or register connector metadata.
- `POST /api/v1/developer/connector-sdk`: Return connector SDK manifest metadata.
- `POST /api/v1/developer/forwarder-sdk`: Return forwarder SDK manifest metadata.
- `POST /api/v1/developer/detection-sdk`: Return detection SDK manifest metadata.
- `POST /api/v1/developer/dashboard-sdk`: Return dashboard SDK manifest metadata.
- `GET /api/v1/developer/docs`: Return developer documentation index.
- `GET /api/v1/developer/help-center`: Return help center topic index.
- `GET /api/v1/developer/cli`: Return CLI tool metadata.
- `GET /api/v1/developer/system-audit-api`: Return system audit API metadata.

## Detection Engineering

- `GET /api/v1/detection/capabilities`: Return detection engineering capability matrix.
- `GET /api/v1/detection/rules`, `POST /api/v1/detection/rules`: List or create detection rules.
- `GET /api/v1/detection/rules/{rule_id}`, `PUT /api/v1/detection/rules/{rule_id}`, `DELETE /api/v1/detection/rules/{rule_id}`: Read, update, or delete a detection rule.
- `POST /api/v1/detection/rules/{rule_id}/test`: Test a rule against a sample event.
- `POST /api/v1/detection/rules/import/sigma`: Validate Sigma-like rule import content.
- `GET /api/v1/detection/rules/{rule_id}/export/sigma`: Export a rule as Sigma-like YAML.
- `POST /api/v1/detection/rules/convert/sigma`: Convert Sigma-like content into an InsoQL, threshold, or custom rule draft.
- `POST /api/v1/detection/rules/custom/validate`: Validate custom JSON rule content.
- `POST /api/v1/detection/threshold/preview`: Preview threshold detection behavior.
- `POST /api/v1/detection/correlation/preview`: Preview correlation detection behavior.
- `POST /api/v1/detection/sequence/preview`: Preview sequence detection behavior.
- `POST /api/v1/detection/statistical/preview`: Preview statistical detection behavior.
- `POST /api/v1/detection/anomaly/preview`: Preview anomaly scoring.
- `POST /api/v1/detection/ml/preview`: Preview ML detection features.
- `POST /api/v1/detection/behavioral/preview`: Preview behavioral detection signals.
- `POST /api/v1/detection/hunt/query`: Build a deterministic threat-hunting query draft.
- `POST /api/v1/detection/simulate`: Simulate a rule against sample events.
- `POST /api/v1/detection/benchmark`: Estimate rule complexity.
- `GET /api/v1/detection/rules/{rule_id}/versions`: Return rule version visibility.
- `GET /api/v1/detection/dac/status`: Return detection-as-code status.
- `GET /api/v1/detection/git/status`: Return detection Git sync status.
- `POST /api/v1/detection/rules/{rule_id}/approval`: Record an approval workflow decision.
- `GET /api/v1/detection/coverage/gaps`: Return detection coverage gaps.
- `GET /api/v1/detection/mitre/map`: Return MITRE rule mapping.
- `GET /api/v1/detection/mitre/coverage`: Return MITRE heatmap data.
- `GET /api/v1/detection/kill-chain/map`: Return kill-chain mapping.
- `GET /api/v1/detection/false-positive/analytics`: Return false-positive analytics readiness.
