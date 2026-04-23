# Sellable MVP Checklist

| Item | Status | Notes |
|---|---|---|
| App starts without critical errors | In progress | Backend/frontend builds are validated during cycles. |
| User can register | In progress | Tenant bootstrap registration API and UI added in cycle 1; password reset API foundation added in cycle 7H. |
| User can log in | Completed | Login API and UI exist. |
| Admin can manage users | Completed | Tenant-scoped user management APIs exist; dedicated UI remains pending. |
| Roles and permissions exist | Completed | RBAC routes, models, and seeded roles/permissions exist. |
| Dashboard loads | Completed | Dashboard UI and APIs exist. |
| Logs can be ingested or uploaded | In progress | REST, bulk, batch upload, webhook, OTLP, syslog TCP/UDP, gRPC readiness, syslog TLS readiness, Kafka readiness, auth, rate, queue, DLQ, malformed, and dedup APIs now exist; upload UI and runtime queue tests remain pending. |
| Logs can be viewed/searched | Completed | Search page and backend search APIs exist, including query helpers, templates, permission visibility, history drafts, and CSV/JSON/PDF export routes. |
| Alerts can be created or generated | In progress | Alert and detection APIs now cover generation preview, risk scoring, deduplication, grouping, suppression, escalation, SLA, evidence, timeline, tuning, priority, and review foundations; persistence/UI hardening remains pending. |
| Cases can be created from alerts | In progress | Incident create-from-alert links tenant-validated alerts, case aliases exist, and incident workflow APIs now cover notes, evidence, custody, RCA, affected entities, IOCs, review, reports, summaries, and closure. UI and persistence hardening remain pending. |
| AI summary works or safe mock mode exists | Completed | AI summary/suggest/chat endpoints and expanded AI SOC safe-mode APIs now cover triage, investigation, reports, citations, hallucination checks, guardrails, privacy redaction, model status, and RAG readiness. |
| Threat intelligence exists | In progress | Threat-intel APIs now cover feeds, IOCs, matching, expiry, confidence, reputation, integration readiness, actors, malware families, campaigns, and dashboard summary. Persistence and live feed sync remain pending. |
| SOAR safety mode exists | In progress | SOAR APIs now cover playbooks, dry-run actions, approvals, notifications, tickets, integration readiness, safety controls, rate limits, audit events, and rollback preview. Live automation remains gated. |
| Asset and identity analytics exist | In progress | Asset risk, ownership, tagging, criticality, identity inventory, IAM risk, UEBA, impossible travel, MFA fatigue, password spraying, security analytics, and cloud security analytics APIs now exist. Persistent telemetry and UI workflows remain pending. |
| Audit logs exist | In progress | Audit model, service, admin read APIs, incident mutation audit writes, CSV export, Alembic scaffold, and admin UI now exist; compliance evidence/report metadata APIs were added; deeper service tests and full coverage remain pending. |
| Settings page exists | Partial | Backend settings, privacy, system-admin, secret metadata, and deployment readiness APIs exist; frontend page is a placeholder. |
| `.env.example` exists | Completed | Present at repo root. |
| README is professional | In progress | Added in cycle 1. |
| Deployment guide exists | Completed | `docs/deployment_guide.md` added with Docker, migration, validation, and rollback notes. |
| Known issues are documented | Completed | `docs/known_issues.md` added with release-blocking and non-blocking issues. |
| No real secrets are hardcoded | In progress | Secrets detection API now fingerprints supplied artifacts without returning secret values; full repository Security Hardening Agent review remains pending. |
| Basic security review is completed | Pending | Security Hardening Agent pending. |
| Basic test/build validation is completed | In progress | Cycle 7H backend compile, backend tests, and frontend build passed; recorded in `test_results.md`. |
