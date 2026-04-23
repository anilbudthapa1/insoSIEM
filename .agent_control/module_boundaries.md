# Module Boundaries

## Backend Modules

- `auth`: login, refresh, MFA, session security.
- `rbac`: roles, permissions, assignments.
- `organizations`: tenant and MSSP control plane.
- `platform`: license, usage, branding, billing, settings.
- `agents_module`: forwarder enrollment, health, policy, and collector configuration.
- `ingestion`: event intake, syslog, queue publishing, replay safety, rate limiting, and malformed events.
- `parsers`: parser implementations, parser catalog, parser testing, parser error reporting.
- `normalization`: common event schema, field mapping, timestamp and timezone normalization.
- `search`: query parsing, search execution, saved searches, query history, field discovery, timeline APIs.
- `detection`: detection-as-code, Sigma, correlation, simulation, versioning, MITRE mapping.
- `alerts`: alert lifecycle, suppression, maintenance windows, prioritization.
- `incidents`: incidents, timelines, evidence, case links.
- `ai`: evidence-grounded AI workflows, provider settings, usage metering, prompt audit.

## Boundary Rules

- High-volume event processing should not be added to `agents_module`; agents define policy and identity only.
- UI state should not leak into backend models.
- AI modules must not query raw stores directly without evidence IDs and tenant checks.
- Parser logic should not create alerts directly; detection modules consume normalized events.

