# Product Roadmap

## Roadmap Principle

Build the SIEM data foundation before expanding AI. AI output is only valuable when it can cite trustworthy normalized logs, alerts, cases, assets, and detections.

## Phase 1: Foundation

- Ingestion reliability: REST, syslog, forwarder, file, cloud, and webhook ingestion with replay safety.
- Parser quality: parser catalog, parser tests, parser error monitoring, and schema drift detection.
- Normalized event schema: consistent fields for identity, asset, network, process, cloud, web, and detection context.
- Search workflows: saved searches, query history, query validation, aggregation, and dashboard-ready APIs.
- Tenant-safe security: RBAC, audit, MFA, API keys, rate limits, and secrets handling.

## Phase 2: SOC Workflows

- Alert prioritization, suppression, maintenance windows, watchlists, evidence collection, and case management.
- Detection-as-code with versioning, rollback, simulation, and MITRE mapping.
- SOAR playbooks with approval gates and safe response actions.

## Phase 3: AI SOC

- Evidence-based AI alert summaries, investigation assistant, natural language query generation, timeline generation, false positive explanation, and report drafting.
- AI provider settings for OpenAI-compatible, Ollama-compatible, and custom endpoints.
- AI audit logging, usage metering, evidence references, and confidence scoring.

## Phase 4: Enterprise Readiness

- Compliance reports, report scheduler, exports, backup/restore, disaster recovery, deployment docs, performance baseline, and release quality gates.

