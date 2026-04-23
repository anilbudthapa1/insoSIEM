# Handoff Notes

## 2026-04-21 Orchestrator Setup

The user clarified that a strong SIEM data foundation is more important than adding AI features prematurely. Logs must be complete, deduplicated, parsed, normalized, enriched, and traceable before AI is trusted for SOC decisions.

The orchestrator must use specialist agents in order:

Product planning, architecture, backend/frontend/data pipeline build, detection and AI, security, QA, performance, DevOps, documentation, and release.

Do not run all agents at once. Do not allow overlapping writes without clear ownership.

## 2026-04-22 Cycle 4 Handoff

Incident workflow is now functional enough for analyst triage: incident rows open a detail modal, status changes are saved through `PATCH /api/v1/incidents/{incident_id}`, timeline notes can be added, and create-from-alert sends `alert_ids` that the backend links after tenant validation.

Cycle 5A added the audit model/service/router and admin read endpoints. Incident create/update/delete/link/timeline actions now attempt audit writes inside a nested transaction so audit write failures do not roll back the primary incident workflow.

Cycle 5B aligned the audit ORM with `infra/postgres/init.sql`, added CSV export, added an admin `/audit-logs` page, and introduced a backend Alembic scaffold with an idempotent `audit_logs` migration.

The next cycle should add service-level tenant-isolation tests, audit coverage for other mutating modules, and secure-default review. Do not call audit sellable-complete until runtime persistence is verified against PostgreSQL.

## 2026-04-22 Cycle 7A Handoff

The app-guide tracker now shows exactly 24.0% coverage: 106 Implemented and 14 Partial modules out of 500. This is implemented-or-partial catalog coverage, not a sellable-MVP declaration.

Code-backed additions include collector policy modules 71-75, ingestion REST/webhook/batch-upload/auth/rate/queue/DLQ/malformed/dedup endpoints, parsing and normalization APIs, CSV/XML/LEEF/regex/Grok parser helpers, and search CSV/JSON export routes.

Important residual risks: syslog TLS, Kafka ingestion, external NATS subscription ingest, persistent parser failure metrics, full OCSF/OSSEM converters, inline asset/identity/cloud/risk enrichment, and storage/indexing lifecycle modules remain incomplete. Next cycle should continue with modules 125-160 and add end-to-end tests against Redis/NATS/ClickHouse where possible.

## 2026-04-22 Cycle 7B Handoff

The app-guide tracker now shows exactly 34.0% coverage: 131 Implemented and 39 Partial modules out of 500. This is still implemented-or-partial catalog coverage, not a sellable-MVP declaration.

Code-backed additions include `/api/v1/enrichment/*`, `/api/v1/storage/*`, and expanded `/api/v1/search/*` contracts for query parsing, safe translation, deterministic query generation, query explanation, saved/scheduled drafts, history, templates, performance, permissions, federated readiness, archive readiness, and export.

Important residual risks: backup/restore, PDF export, database-backed saved/scheduled searches, persistent storage metrics, object-store lifecycle jobs, external threat/intel/cloud/scanner integrations, and detection engineering modules 186-209 remain incomplete. Next cycle should prioritize backup/restore and detection engineering foundations before moving into SOAR modules.

## 2026-04-22 Cycle 7C Handoff

The app-guide tracker now shows exactly 44.0% coverage: 156 Implemented and 64 Partial modules out of 500. This is implemented-or-partial catalog coverage, not a sellable-MVP declaration.

Code-backed additions include search PDF export, expanded `/api/v1/detection/*` contracts for Sigma and rule workflow foundations, and expanded `/api/v1/alerts/*` contracts for risk scoring, grouping, suppression, escalation, comments, evidence, SLA, timeline, tuning, priority, and review workflows.

Important residual risks: detection previews are deterministic API foundations rather than full streaming engines, Sigma import/conversion persistence is still dry-run oriented, alert comments/evidence/reviews/suppression/escalation policies are in memory, PDF export is compact rather than a polished report renderer, and alert audit trail module 230 is not yet counted. Next cycle should continue with alert audit trail plus incident/case modules 231-250.

## 2026-04-22 Cycle 7D Handoff

The app-guide tracker now shows exactly 54.0% coverage: 178 Implemented and 92 Partial modules out of 500. This is implemented-or-partial catalog coverage, not a sellable-MVP declaration.

Code-backed additions include alert audit-trail visibility, expanded `/api/v1/incidents/*` and `/api/v1/cases/*` workflow contracts, and expanded `/api/v1/ai/*` safe-mode SOC assistant contracts for triage, investigation, reporting, guardrails, redaction, prompt audit, model status, and RAG context.

Important residual risks: many incident/case extensions use in-memory workflow stores, case aliases still reuse incident records, AI endpoints are deterministic safe-mode foundations rather than live LLM orchestration, prompt audit and guardrail state are in memory, and RAG does not yet have vector database persistence. Next cycle should prioritize SOC knowledge base and threat-intelligence modules 280-329.

## 2026-04-22 Cycle 7E Handoff

The app-guide tracker now shows exactly 64.0% coverage: 193 Implemented and 127 Partial modules out of 500. This is implemented-or-partial catalog coverage, not a sellable-MVP declaration.

Code-backed additions include SOC knowledge-base routes, `/api/v1/threat-intel/*` routes for IOC/feed/reputation/integration-readiness workflows, `/api/v1/soar/*` routes for automation/playbook/safety workflows, and `/api/v1/assets/*` discovery and attack-surface preview routes.

Important residual risks: threat-intel and SOAR state is in memory, external MISP/VirusTotal/AbuseIPDB/OTX/STIX-TAXII/Jira/ServiceNow/EDR integrations are status-only, automation actions are preview/dry-run only, and asset discovery does not yet execute real scanners or cloud connectors. Next cycle should continue with modules 330-379 and persistence hardening.

## 2026-04-22 Cycle 7F Handoff

The app-guide tracker now shows exactly 74.0% coverage: 200 Implemented and 170 Partial modules out of 500. This is implemented-or-partial catalog coverage, not a sellable-MVP declaration.

Code-backed additions include asset risk/ownership/tagging/criticality routes, `/api/v1/identity/*` identity and UEBA routes, and `/api/v1/security-analytics/*` detection-pack and cloud security analytics routes.

Important residual risks: identity inventory and UEBA baselines are in memory, directory/cloud identity integrations are status-only, security analytics packs score supplied sample events rather than persistent telemetry streams, and cloud security analytics do not yet call live cloud APIs. Next cycle should continue with modules 380-429 and persistence/UI hardening.

## 2026-04-22 Cycle 7G Handoff

The app-guide tracker now shows exactly 84.0% coverage: 200 Implemented and 220 Partial modules out of 500. This is implemented-or-partial catalog coverage, not a sellable-MVP declaration.

Code-backed additions include `/api/v1/cloud-security/*`, `/api/v1/vulnerabilities/*`, and `/api/v1/compliance/*` routes for cloud/container/DevSecOps signal scoring, secret fingerprinting, scanner readiness, vulnerability prioritization, graph summaries, framework mappings, compliance reporting, and data residency policy controls.

Important residual risks: cloud and scanner integrations are status or supplied-event workflows rather than live connectors, compliance policies and residency state are in memory, report endpoints generate metadata rather than rendered deliverables, and UI workflows are still pending. Next cycle should continue with modules 430-480 for privacy, SOC operations/metrics, simulation/validation, and system administration.

## 2026-04-22 Cycle 7H Handoff

The app-guide tracker now shows exactly 100.0% foundation coverage: 204 Implemented and 296 Partial modules out of 500. This is implemented-or-partial catalog coverage, not a sellable-MVP or release-ready declaration.

Code-backed additions include auth password reset routes, ingestion readiness routes for gRPC/syslog TLS/Kafka, storage backup/restore preview routes, compliance privacy routes, `/api/v1/soc-operations/*`, `/api/v1/validation/*`, `/api/v1/system-admin/*`, and `/api/v1/developer/*` routes.

Important residual risks: many newly covered modules are preview/status/metadata APIs or in-memory tenant state. Sellable hardening must prioritize durable database persistence, UI workflows, granular RBAC, audit events for all mutating APIs, live connector validation, rendered reports, runtime jobs, E2E tests, and performance/security release gates.

## 2026-04-22 Cycle 7I Handoff

The root README is now the primary entry guide for operators and developers. It documents the 100.0% app-guide foundation coverage, explains that the platform is not release-ready yet, lists the full feature map, corrects the ingestion prefix to `/api/v1/ingest`, and adds Docker Compose, local backend, local frontend, migration, validation, environment-variable, security, and troubleshooting guidance.

Documentation validation was limited to README sanity checks: no stale `/api/v1/ingestion` reference remained, referenced project docs existed, and the file was kept ASCII-only. No backend or frontend test suite was rerun during this documentation-only cycle; the last full validation remains Cycle 7H.

## 2026-04-22 Cycle 7J Handoff

Environment setup guidance was aligned with the current backend JWT implementation. `.env.example`, the README, and deployment guide now recommend `JWT_ALGORITHM=HS256` because the active JWT helper signs with `JWT_SECRET_KEY` directly and does not yet consume RS256 private/public key paths.

No backend/frontend test suite was rerun. Validation was limited to checking JWT setup references in `.env.example`, `README.md`, and `docs/deployment_guide.md`.

## 2026-04-22 Cycle 7K Handoff

Local Docker startup is now verified on port 8011. The backend mount failure was caused by mounting `infra/certs` and `data/geoip` under `/app` while `/app` was already a read-only bind mount from `./backend`. `docker-compose.yml` now removes the backend cert mount and mounts GeoIP at `/opt/geoip`, with `GEOIP_DB_PATH` pointed at `/opt/geoip/GeoLite2-City.mmdb`.

The Nginx reverse proxy is published as `${HTTP_PORT:-8011}:80`, `.env.example` documents `HTTP_PORT=8011`, and the local `.env` was adjusted to `APP_URL=http://localhost:8011` and `VITE_WS_URL=ws://localhost:8011/api/v1/ws`. The backend healthcheck now uses `curl`, which exists in the backend image, and the backend Dockerfile now starts one Uvicorn worker to avoid multiple workers binding the same syslog listener.

## 2026-04-22 Cycle 7L Handoff

Blank-after-login was caused by a chain of auth/runtime issues. First, the seeded login `admin@inso.local` was rejected by `EmailStr` because `.local` is reserved; auth and user schemas now use a local `InternalEmail` field type that accepts internal domains. Second, the frontend login page attempted to render structured validation error arrays directly; it now normalizes validation details into text.

After that, login exposed two backend runtime problems: passlib was incompatible with the installed bcrypt backend, and the seed hash in `infra/postgres/init.sql` did not match `Admin123!`. Password helpers now use direct `bcrypt`, the seed hash was corrected, and the current Docker database row was updated in place. Finally, `refresh_tokens.ip_address` now uses PostgreSQL `INET` in the ORM to match the bootstrap schema. API login and a headless Chromium login-to-dashboard smoke test both pass on `http://localhost:8011`.
