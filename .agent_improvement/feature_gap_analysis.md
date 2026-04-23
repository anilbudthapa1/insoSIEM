# Feature Gap Analysis

## Existing Features

- FastAPI backend with JWT auth, MFA primitives, sessions, users, RBAC, tenants, platform settings, ingestion, search, alerts, incidents, assets, AI assistant stubs, and agent/collector policy APIs.
- React frontend with dashboard, search, alerts, incidents, assets, detection, and AI pages.
- NATS/syslog/ClickHouse-oriented architecture, Docker Compose, and route contract tests.

## Missing Or Weak Features

- Search lacks saved searches, query history, and explicit query validation endpoints.
- AI responses are mostly deterministic stubs and need evidence references, provider settings, usage metering, and auditability.
- Audit log model/service is referenced by dependencies but not exposed as a complete product feature.
- Detection lifecycle lacks versioning, rollback, simulation, and rule-quality scoring.
- Reporting/compliance, SOAR approval workflows, integration marketplace, and admin observability remain incomplete.

## Cycle 1 Recommendation

Prioritize search usability and product tracking: add saved searches, query history, and query validation. These are low-risk, high-value SIEM workflow features that fit the existing backend.

