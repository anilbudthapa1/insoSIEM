# Market Gap Analysis

## Strong Existing Areas

- Core authentication, MFA primitives, sessions, RBAC, multi-tenant organizations, alerts, incidents, assets, search, ingestion, and agent policy APIs exist.
- The app has a broad module compliance tracker and Docker Compose deployment shape.
- Frontend already has core SOC pages for dashboard, search, alerts, incidents, assets, detections, and AI.

## Highest-Risk Gaps

- Data pipeline is not yet strong enough for market-grade AI decisions: parser coverage, normalization, deduplication, replay safety, and data quality monitoring need deeper implementation.
- Many collector modules are API policy surfaces but not complete end-to-end ingestion implementations.
- Search needs richer SPL/KQL-like behavior: aggregation, joins, stats, saved searches, query history, and scheduled searches.
- AI is currently stub-like and must become evidence-based with provider abstraction, audit logging, and usage controls.
- Audit logging is referenced but not fully productized in visible APIs and workflows.
- QA, security hardening, performance baselines, release gates, and documentation need formal coverage.

## Competitive Priorities

1. Reliable ingestion and normalized event schema.
2. Search usability and dashboard workflow.
3. Detection lifecycle and MITRE mapping.
4. Case management and response workflow.
5. Evidence-based AI SOC features.
6. Compliance and enterprise operations.

